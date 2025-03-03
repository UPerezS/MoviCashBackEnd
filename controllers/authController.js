const userService = require("../services/userService");
const authService = require("../services/authService"); 4
const emailService = require("../services/emailService");

const { encript, compare } = require("../utils/handlePassword");

// Registro de usuario: operador / administrador
exports.register = async (req, res) => {
  try {
    const { RFC, NombrePersonal, ApPaterno, ApMaterno, Sexo, FechaNacimiento, CorreoElectronico, Password, Rol, Direccion, Telefono } = req.body;

    if (!RFC || !NombrePersonal || !ApPaterno || !CorreoElectronico || !Password || !Rol) {
      return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
    }

    const hashedPassword = await encript(Password);

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
      Telefono
    });

    res.status(201).json({ message: `${Rol} registrado exitosamente`, usuario: newUsuario });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { CorreoElectronico, Password } = req.body;

    const usuario = await userService.getUserByEmail(CorreoElectronico);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await compare(Password, usuario.Password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar código de verificación
    const codigo = await authService.generarCodigoVerificacion(usuario._id);
    await emailService.enviarCodigo(CorreoElectronico, codigo);

    res.status(200).json({ message: "Código de verificación enviado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verificar código ingresado
exports.verificarCodigoYGenerarToken = async (req, res) => {
  try {
    const { CorreoElectronico, code } = req.body;

    const usuario = await userService.getUserByEmail(CorreoElectronico);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const esValido = await authService.verificarCodigo(usuario._id, code);
    if (!esValido) {
      return res.status(400).json({ error: "Código inválido o expirado" });
    }

    // Generar JWT ahora que el código fue validado
    const token = authService.generarToken(usuario);

    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};