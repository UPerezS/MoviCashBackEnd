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
            return res.status(403).json({ error: "El SuperAdmin ya existe y no se puede crear otro." });
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
            Rol: "SuperAdmin",
            Direccion,
            Telefono
        });

        res.status(201).json({ message: "SuperAdmin registrado exitosamente", superAdmin });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
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
        console.error("Error al obtener el SuperAdmin:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Ruta para actualizar el SuperAdmin, pero sin permitir cambiar el rol
const updateSuperAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.Rol && updateData.Rol !== "SuperAdmin") {
            return res.status(403).json({ error: "No se puede cambiar el rol del SuperAdmin." });
        }

        const updatedSuperAdmin = await superService.updateSuperAdmin(id, updateData);
        res.status(200).json({ message: "Superadmin actualizado con éxito", updatedSuperAdmin });
    } catch (error) {
        console.error("Error al actualizar el SuperAdmin:", error);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

module.exports = { registerSuperAdmin, getSuperAdmin, updateSuperAdmin };