const { encript } = require("../utils/handlePassword");
const operatorService = require("../services/registerService");

// Registro de operador / administrador
const register = async (req, res) => {
  try {
    const { RFC, NombrePersonal, ApPaterno, ApMaterno, Sexo, FechaNacimiento, CorreoElectronico, Password, Rol, Direccion, Telefono } = req.body;

    if (!RFC || !NombrePersonal || !ApPaterno || !CorreoElectronico || !Password || !Rol) {
      return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
    }

    const hashedPassword = await encript(Password);

    const newOperator = await operatorService.registerOperator({
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

    res.status(201).json({ message: "Operador/Administrador registrado exitosamente", operator: newOperator });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Exportación del controlador para su uso en las rutas
module.exports = { register };