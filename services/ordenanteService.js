const Ordenante = require('../models/ordenante');
const mongoose = require("mongoose");

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
        return { message: "Error interno del servidor." };
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
        return { message: "Error interno del servidor." };
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
        return { message: "Error interno del servidor." };
    }
};

// Crear un nuevo ordenante
exports.createOrdenante = async (ordenanteData) => {
    try {
        const newOrdenante = new Ordenante(ordenanteData);
        await newOrdenante.save();
        return { message: "Ordenante creado con éxito.", data: newOrdenante };
    } catch (error) {
        console.error("Error al crear el ordenante: ", error);
        return { message: "Error interno del servidor." };
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
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};


exports.updateOrdenante = async (RFCOrdenante, ordenanteData) => {
    try {
        // Verificar si el ordenante existe
        const ordenante = await Ordenante.findOne({ RFCOrdenante });
        if (!ordenante) {
            return { error: true, message: "Ordenante no encontrado." };
        }
        if (ordenanteData.FechaNacimiento) {
            ordenanteData.FechaNacimiento = new Date(ordenanteData.FechaNacimiento);
        }
        if (ordenanteData.FechaRegistro) {
            ordenanteData.FechaRegistro = new Date(ordenanteData.FechaRegistro);
        }
        if (ordenanteData.Saldo !== undefined) {
            ordenanteData.Saldo = mongoose.Types.Decimal128.fromString(ordenanteData.Saldo.toString());
        }

        ordenanteData.FechaActualizacion = new Date();

        const updatedOrdenante = await Ordenante.findOneAndUpdate(
            { RFCOrdenante },
            { $set: ordenanteData },
            { new: true, runValidators: true, context: 'query' }
        );

        return { message: "Ordenante actualizado correctamente.", data: updatedOrdenante };

    } catch (error) {
        console.error("Error al actualizar el ordenante:", error);
        return { error: true, message: "Error interno del servidor.", details: error.message };
    }
};
