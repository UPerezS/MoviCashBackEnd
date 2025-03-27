const Ordenante = require('../models/ordenante');
const mongoose = require("mongoose");
const Personal = require("../models/personal");

// Obtener ordenante por el RFC
exports.getOrdenanteByRFC = async (RFCOrdenante) => {
    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante });
        if (!ordenante) {
            return { message: "Ordenante no encontrado." };
        }
        return { message: "Ordenante encontrado.", data: ordenante };
    } catch (error) {
        console.error("Error al obtener el ordenante: ", error);
        return error;
    }
};

// Obtener ordenante por el Apellido
exports.getOrdenanteByApellido = async (ApPaterno) => {
    try {
        const ordenante = await Ordenante.find({ ApPaterno });
        if (!ordenante) {
            return { message: "Ordenante no encontrado." };
        }
        return { message: "Ordenante(s) encontrado(s).", data: ordenante };
    } catch (error) {
        console.error("Error al obtener el ordenante: ", error);
        return error;
    }
}

// Obtener todos los ordenantes
exports.getAllOrdenantes = async () => {
    try {
        const ordenantes = await Ordenante.find();
        if (ordenantes.length === 0) {
            return { message: "No se encontraron ordenantes." };
        }
        return { message: "Ordenantes encontrados.", data: ordenantes };
    } catch (error) {
        console.error("Error al obtener los ordenantes: ", error);
        return error;
    }
};

// Crear un nuevo ordenante
exports.createOrdenante = async (userId,ordenanteData) => {
    try {
        console.log(userId);

        const operador = await Personal.findOne({ _id: new mongoose.Types.ObjectId(userId) });

        if (!operador) {
            return { error: "Operador no encontrado." };
        }

        ordenanteData.RFCOperador = operador.RFC;

        const newOrdenante = new Ordenante(ordenanteData);
        await newOrdenante.save();
        return { message: "Ordenante creado con éxito.", data: newOrdenante };
    } catch (error) {
        console.error("Error al crear el ordenante: ", error);
        throw new Error("Error al crear el ordenante: " + error.message);  // Lanza el error correctamente
    }
};

// Eliminar un ordenante
exports.deleteOrdenante = async (req, res) => {
    const { RFCOrdenante } = req.params;

    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        await Ordenante.deleteOne({ RFCOrdenante });
        return res.status(200).json({ message: "Ordenante eliminado correctamente." });

    } catch (error) {
        console.error("Error al eliminar el ordenante: ", error);
        return error;
    }
};


exports.updateOrdenante = async (RFCOrdenante, ordenanteData) => {
    try {
        // Verificar si el ordenante existe
        const ordenante = await Ordenante.findOne({ RFCOrdenante });
        if (!ordenante) {
            return { error: true, message: "Ordenante no encontrado." };
        }

        if (ordenanteData.Saldo !== undefined) {
            ordenanteData.Saldo = mongoose.Types.Decimal128.fromString(ordenanteData.Saldo.toString());
        }

        const updatedOrdenante = await Ordenante.findOneAndUpdate(
            { RFCOrdenante },
            { $set: ordenanteData },
            { new: true, runValidators: true, context: 'query' }
        );

        return { message: "Ordenante actualizado correctamente.", updatedOrdenante };

    } catch (error) {
        console.error("Error al actualizar el ordenante:", error);
        return error;
    }
};
