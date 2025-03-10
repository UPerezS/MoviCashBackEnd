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

// Obtener ordenante por el apellido
exports.getOrdenanteByApellido = async (userData) => {
    try {
        const ordenante = await Ordenante.findOne({ ApPaterno: {$eq:userData.ApPaterno} });
        if (!ordenante) {
            return { message: "Ordenante no encontrado." };
        }
        return ordenante;
    } catch (error) {
        console.error("Error al obtener el ordenante: ", error);
        return { message: "Error interno del servidor." };
    }
};

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
    const { RFCOrdenante } = req.params;  // Obtenemos el RFC del ordenante desde los parámetros de la URL

    try {
        // Buscamos el ordenante por su RFC
        const ordenante = await Ordenante.findOne({ RFCOrdenante });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        // Si el ordenante existe, se procede a eliminarlo
        await Ordenante.deleteOne({ RFCOrdenante });
        return res.status(200).json({ message: "Ordenante eliminado correctamente." });

    } catch (error) {
        // En caso de error, se captura y se responde con el mensaje de error
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

        // Convertir datos a los tipos correctos
        if (ordenanteData.FechaNacimiento) {
            ordenanteData.FechaNacimiento = new Date(ordenanteData.FechaNacimiento);
        }
        if (ordenanteData.FechaRegistro) {
            ordenanteData.FechaRegistro = new Date(ordenanteData.FechaRegistro);
        }
        if (ordenanteData.Saldo !== undefined) {
            ordenanteData.Saldo = mongoose.Types.Decimal128.fromString(ordenanteData.Saldo.toString());
        }

        // Agregar la fecha de actualización
        ordenanteData.FechaActualizacion = new Date();

        // Actualizar con validaciones
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
