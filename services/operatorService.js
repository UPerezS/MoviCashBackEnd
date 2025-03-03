const Personal = require("../models/personal");
const bcrypt = require("bcryptjs");

// Obtener operador por correo electrónico
const getOperatorByEmail = async (CorreoElectronico) => {
    try {
        return await Personal.findOne({ CorreoElectronico });
    } catch (error) {
        throw new Error("Error al obtener operador por correo: " + error.message);
    }
};

// Obtener un operador por RFC
const getOperatorByRFC = async (RFC) => {
    try {
        return await Personal.findOne({ RFC });
    } catch (error) {
        throw new Error("Error al obtener operador: " + error.message);
    }
};

// Obtener todos los operadores
const getAllOperators = async () => {
    try {
        return await Personal.find({ Rol: "Operador" });
    } catch (error) {
        throw new Error("Error al obtener operadores: " + error.message);
    }
};

// Actualizar datos de un operador
const updateOperator = async (RFC, updateData) => {
    try {
        if (updateData.Password) {
            updateData.Password = await bcrypt.hash(updateData.Password, 10);
        }

        const updated = await Personal.findOneAndUpdate(
            { RFC },
            { $set: updateData },
            { new: true }
        );
        return updated;
    } catch (error) {
        throw new Error("Error al actualizar operador: " + error.message);
    }
};

// Eliminar un operador por RFC
const deleteOperator = async (RFC) => {
    try {
        const deleted = await Personal.findOneAndDelete({ RFC });
        return deleted;
    } catch (error) {
        throw new Error("Error al eliminar operador: " + error.message);
    }
};

module.exports = {
    getOperatorByEmail,
    getOperatorByRFC,
    getAllOperators,
    updateOperator,
    deleteOperator
};