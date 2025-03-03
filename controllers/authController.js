const { encript, compare } = require("../utils/handlePassword");
const userService = require("../services/userService");

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

    // Buscar al usuario por correo electrónico
    const personal = await userService.getUserByEmail(CorreoElectronico);
    if (!personal) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await compare(Password, personal.Password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};