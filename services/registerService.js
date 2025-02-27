const Personal = require("../models/personal");
const bcrypt = require("bcryptjs");

// Registrar un operador/administrador
const registerOperator = async (operatorData) => {
    try {
        // Verificar si el operador ya existe
        const existingOperator = await Personal.findOne({ RFC: operatorData.RFC });
        if (existingOperator) {
            throw new Error("El operador ya está registrado.");
        }

        // Hashear la contraseña antes de guardar
        if (operatorData.Password) {
            operatorData.Password = await bcrypt.hash(operatorData.Password, 10);
        }

        const newOperator = new Personal(operatorData);
        return await newOperator.save();
    } catch (error) {
        throw new Error("Error al registrar operador: " + error.message);
    }
};

module.exports = {
    registerOperator
};