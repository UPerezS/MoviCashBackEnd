const userService = require('../services/userService');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const { hash, compare, generateTempPassword } = require('../utils/handlePassword');
const generateCode = require('../utils/handleCode');
const Personal = require("../models/personal");
const Ordenante = require("../models/ordenante");

// Registro de usuario: operador / administrador
exports.register = async (req, res) => {
  try {
    const { RFC, NombrePersonal, ApPaterno, ApMaterno, Sexo, FechaNacimiento, CorreoElectronico, Rol, Direccion, Telefono } = req.body;

    if (!RFC || !NombrePersonal || !ApPaterno || !CorreoElectronico || !Rol) {
      return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
    }

    const tempPassword = generateCode(10);
    const hashedPassword = await hash(tempPassword);

    const newUsuario = await userService.registerUser({
      RFC,
      NombrePersonal,
      ApPaterno,
      ApMaterno,
      Sexo,
      FechaNacimiento,
      CorreoElectronico,
      Password: hashedPassword,
      Rol,
      Direccion,
      Telefono,
      Estado: "Inactivo", // Hasta que cambie la contraseña
    });


    // Enviar correo con la contraseña temporal
    try {
      await emailService.enviarCodigo(CorreoElectronico, tempPassword);
      console.log(`Correo enviado a: ${CorreoElectronico}`);
    } catch (emailError) {
      console.error(`Error al enviar el correo a ${CorreoElectronico}:`, emailError.message);
    }

    res.status(201).json({ message: `${Rol} registrado exitosamente`, usuario: newUsuario });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { CorreoElectronico, Password } = req.body;

    const usuario = await userService.getUserByEmail(CorreoElectronico);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.Estado === "Bloqueado") {
      return res.status(403).json({ error: "Tu cuenta ha sido bloqueada. Contacta al administrador." });
    }

    const isMatch = await compare(Password, usuario.Password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const code = await authService.generarCodigoVerificacion(usuario._id);
    await emailService.enviarCodigo(CorreoElectronico, code);

    res.status(200).json({ message: 'Código de verificación enviado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.verificarCodigoYGenerarToken = async (req, res) => {
  try {
    const { CorreoElectronico, code } = req.body;

    const usuario = await userService.getUserByEmail(CorreoElectronico);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isValid = await authService.verificarCodigo(usuario._id, code);
    if (!isValid) {
      return res.status(400).json({ error: "Código inválido o expirado" });
    }

    const token = await authService.generarToken(usuario);

    // Enviar el token por correo
    try {
      await emailService.enviarCodigo(CorreoElectronico, `Tu token de acceso es: ${token}`);
      console.log(`Token enviado a: ${CorreoElectronico}`);
    } catch (emailError) {
      console.error(`Error al enviar el token por correo:`, emailError.message);
    }

    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error en verificarCodigoYGenerarToken:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Recuperar contraseña
exports.recoverPassword = async (req, res) => {
  try {
    const { CorreoElectronico } = req.body;

    const user = await userService.getUserByEmail(CorreoElectronico);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const tempPassword = generateTempPassword();
    user.Password = await hash(tempPassword);
    await user.save();

    res.status(200).json({ message: "Contraseña temporal generada", tempPassword });
  } catch (error) {
    console.error("Error en la recuperación de contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar contraseña 
exports.updatePassword = async (req, res) => {
  try {
    const { CorreoElectronico, tempPassword, newPassword } = req.body;

    const user = await userService.getUserByEmail(CorreoElectronico);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await compare(tempPassword, user.Password);
    if (!isMatch) {
      return res.status(401).json({ error: "La contraseña temporal es incorrecta" });
    }

    user.Password = await hash(newPassword);
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Bloquear usuario por RFC
exports.blockUser = async (req, res) => {
  const { RFC } = req.params;
  const usuarioAutenticado = req.user;

  try {
    if (!["Admin", "SuperAdmin"].includes(usuarioAutenticado.role)) {
      return res.status(403).json({ message: "No tienes permisos para bloquear usuarios." });
    }

    if (usuarioAutenticado.RFC === RFC) {
      return res.status(403).json({ message: "No puedes bloquearte a ti mismo." });
    }

    let usuario = await Personal.findOne({ RFC });
    let ordenante = await Ordenante.findOne({ RFCOrdenante: RFC });

    if (!usuario && !ordenante) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (usuario) {
      if (usuario.Rol === "SuperAdmin") {
        return res.status(403).json({ message: "No se puede bloquear al SuperAdmin." });
      }
      usuario.Estado = "Bloqueado";
      await usuario.save();
    }

    if (ordenante) {
      ordenante.Estado = "Bloqueado";
      await ordenante.save();
    }

    res.status(200).json({ message: "Usuario bloqueado con éxito." });
  } catch (error) {
    console.error("Error al bloquear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Desbloquear usuarios por RFC
exports.unblockUser = async (req, res) => {
  const { RFC } = req.params;
  const usuarioAutenticado = req.user;

  try {
    if (!["Admin", "SuperAdmin"].includes(usuarioAutenticado.role)) {
      return res.status(403).json({ message: "No tienes permisos para desbloquear usuarios." });
    }

    let usuario = await Personal.findOne({ RFC });
    let ordenante = await Ordenante.findOne({ RFCOrdenante: RFC });

    if (!usuario && !ordenante) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (usuario) {
      if (usuario.Estado !== "Bloqueado") {
        return res.status(400).json({ message: "El usuario no está bloqueado." });
      }
      usuario.Estado = "Activo";
      await usuario.save();
    }

    if (ordenante) {
      if (ordenante.Estado !== "Bloqueado") {
        return res.status(400).json({ message: "El ordenante no está bloqueado." });
      }
      ordenante.Estado = "Activo";
      await ordenante.save();
    }

    res.status(200).json({ message: "Usuario desbloqueado con éxito." });
  } catch (error) {
    console.error("Error al desbloquear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
