const Personal = require("../models/personal");

// Obtener todos los administradores
const getAllAdministrators = async () => {
    try {
        return await Personal.find({ Rol: "Admin" });
    } catch (error) {
        throw new Error("Error al obtener administradores: " + error.message);
    }
};

// Eliminar un administrador por RFC
const deleteAdmin = async (RFC) => {
    try {
        const exist = await Personal.findOne({ RFC });
        if (!exist) {
            return null;
        }
        await Personal.deleteOne({ RFC });
        return exist; // Devuelve el empleado eliminado
    } catch (error) {
        throw new Error("Error al eliminar el administrador: " + error.message);
    }
};

// Actualizar un administrador por RFC
const updateAdmin = async (RFC, updateData) => {
    try {
        const updated = await Personal.findOneAndUpdate(
            { RFC },
            { $set: updateData },
            { new: true } // Devuelve el documento actualizado
        );
        return updated;
    } catch (error) {
        throw new Error("Error al actualizar el administrador: " + error.message);
    }
};

module.exports = {
    create,
    getAllAdministrators,
    deleteAdmin,
    updateAdmin
};
