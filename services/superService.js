const SuperAdmin = require("../models/personal");

const getSuperAdmin = async () => {
    return await SuperAdmin.findOne({ Rol: "SuperAdmin" });
};

const createSuperAdmin = async (data) => {
    return await SuperAdmin.create(data);
};

// Prevenir la actualización del rol de SuperAdmin
const updateSuperAdmin = async (id, data) => {
    const superAdmin = await SuperAdmin.findById(id);
    if (!superAdmin) {
        throw new Error("SuperAdmin no encontrado.");
    }

    // Evitar modificación del rol
    if (data.Rol && data.Rol !== "SuperAdmin") {
        throw new Error("No se puede cambiar el rol del SuperAdmin.");
    }

    return await SuperAdmin.findByIdAndUpdate(id, data, { new: true });
};

module.exports = { getSuperAdmin, createSuperAdmin, updateSuperAdmin };
