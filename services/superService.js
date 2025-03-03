const SuperAdmin = require("../models/SuperAdmin");

const getSuperAdmin = async () => {
    return await SuperAdmin.findOne({ Rol: "superadmin" });
};

const createSuperAdmin = async (data) => {
    return await SuperAdmin.create(data);
};

module.exports = { getSuperAdmin, createSuperAdmin };