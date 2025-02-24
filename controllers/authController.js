const { encript } = require("../utils/handlePassword");
const personalService = require("../services/personalService");

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { NombrePersonal, CorreoElectronico, Password } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await encript(Password);

    // Crear el usuario
    const newPersonal = await personalService.createPersonal({
      NombrePersonal,
      CorreoElectronico,
      Password: hashedPassword,
    });

    res.status(201).json({ message: "Usuario registrado", personal: newPersonal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { CorreoElectronico, Password } = req.body;
    console.log("Correo recibido:", CorreoElectronico); // Depuración
    console.log("Contraseña recibida:", Password); // Depuración

    // Buscar al usuario por correo electrónico
    const personal = await personalService.getUserByEmail(CorreoElectronico);
    if (!personal) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await compare(Password, personal.Password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.status(200).json({ message: "Inicio de sesión exitoso", personal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};