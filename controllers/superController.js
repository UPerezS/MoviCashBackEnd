const { encript } = require("../utils/handlePassword");
const superService = require("../services/superService");

const registerSuperAdmin = async (req, res) => {
    try {
        const { RFC, NombrePersonal, ApPaterno, ApMaterno, Sexo, FechaNacimiento, CorreoElectronico, Password, Direccion, Telefono } = req.body;

        if (!RFC || !NombrePersonal || !ApPaterno || !CorreoElectronico || !Password) {
            return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
        }

        const existingSuperAdmin = await superService.getSuperAdmin();
        if (existingSuperAdmin) {
            return res.status(403).json({ error: "El superadmin ya existe y no puede ser modificado o eliminado." });
        }

        const hashedPassword = await encript(Password);

        const superAdmin = await superService.createSuperAdmin({
            RFC,
            NombrePersonal,
            ApPaterno,
            ApMaterno,
            Sexo,
            FechaNacimiento,
            CorreoElectronico,
            Password: hashedPassword,
            Rol: "superadmin",
            Direccion,
            Telefono
        });

        res.status(201).json({ message: "Superadmin registrado exitosamente", superAdmin });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getSuperAdmin = async (req, res) => {
    try {
        const superAdmin = await superService.getSuperAdmin();
        if (!superAdmin) {
            return res.status(404).json({ error: "No se encontró un superadmin." });
        }
        res.status(200).json(superAdmin);
    } catch (error) {
        console.error("Error al obtener el superadmin:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { registerSuperAdmin, getSuperAdmin };
