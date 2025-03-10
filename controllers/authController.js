const userService = require('../services/userService');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const { hash, compare, generateTempPassword } = require('../utils/handlePassword');

exports.register = async (req, res) => {
  try {
    const { RFC, NombrePersonal, ApPaterno, ApMaterno, Sexo, FechaNacimiento, CorreoElectronico, Password, Rol, Direccion, Telefono } = req.body;

    if (!RFC || !NombrePersonal || !ApPaterno || !CorreoElectronico || !Password || !Rol) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados.' });
    }

    const hashedPassword = await hash(Password);
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
    });

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
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isValid = await authService.verificarCodigo(usuario._id, code);
    if (!isValid) {
      return res.status(400).json({ error: 'Código inválido o expirado' });
    }

    const token = await authService.generarToken(usuario);
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
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
