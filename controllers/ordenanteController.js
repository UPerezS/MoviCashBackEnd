const Ordenante = require("../models/ordenante");
const { matchedData } = require("express-validator");
const OrdenanteService = require('../services/ordenanteService');


exports.getOrdenanteByRFC = async (req, res) => {
    const { RFCOrdenante } = req.params;

    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        return res.status(200).json({ message: "Ordenante encontrado.", data: ordenante });

    } catch (error) {
        console.error("Error al obtener el ordenante: ", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
}

exports.getOrdenanteByApellido = async (req, res) => {
    try {
        const { ApPaterno } = req.params;

        // Apellido exacto
        const ordenantes = await Ordenante.find({ ApPaterno });

        if (!ordenantes || ordenantes.length === 0) {
            return res.status(404).json({ message: "No se encontró información para el apellido ingresado." });
        }

        return res.status(200).json({ message: "Ordenante(s) encontrado(s).", data: ordenantes });

    } catch (error) {
        console.error("Error al obtener el ordenante: ", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};

exports.getAllOrdenantes = async (req, res) => {
    try {
        const ordenantes = await Ordenante.find();

        if (ordenantes.length === 0) {
            return res.status(404).json({ message: "No se encontraron ordenantes." });
        }

        return res.status(200).json({ message: "Ordenantes encontrados.", data: ordenantes });
    } catch (error) {
        console.error("Error al obtener los ordenantes: ", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};

exports.createOrdenante = async (req, res) => {
    try {
        const body = matchedData(req); // Obtener los datos del cuerpo de la solicitud

        const nuevoOrdenante = new Ordenante(body);
        await nuevoOrdenante.save();

        console.log("Ordenante creado con éxito.");
        res.status(201).json({ message: "Ordenante creado con éxito.", data: nuevoOrdenante });

    } catch (error) {
        console.error("Error al crear el ordenante:", error);
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

exports.deleteOrdenante = async (req, res) => {
    const { RFCOrdenante } = req.params;

    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        await Ordenante.deleteOne({ RFCOrdenante });
        return res.status(200).json({ message: "Ordenante eliminado con éxito." });

    } catch (error) {
        console.error("Error al eliminar el ordenante: ", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};


exports.updateOrdenante = async (req, res) => {
    const { RFCOrdenante } = req.params;
    const ordenanteData = req.body;

    try {
        const result = await OrdenanteService.updateOrdenante(RFCOrdenante, ordenanteData);

        if (result.error) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        return res.status(200).json({ message: "Ordenante actualizado correctamente.", data: result.data });

    } catch (error) {
        console.error("Error al actualizar el ordenante: ", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};


//Actulizar el estado del ordenante 
    exports.updateEstadoOrdenante = async (req, res) => {
        const { RFCOrdenante } = req.params;
        const { Estado } = req.body;

        try {
            const result = await Ordenante.updateOne(
                { RFCOrdenante },
                { $set: { Estado } },
                { runValidators: true }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Ordenante no encontrado." });
            }

            if (result.modifiedCount === 0) {
                return res.status(400).json({ message: "El estado no ha cambiado o no es válido." });
            }

            res.status(200).json({
                message: `Estado del ordenante actualizado a ${Estado}.`,
                updatedCount: result.modifiedCount
            });

        } catch (error) {
            console.error("Error al actualizar el estado del ordenante:", error.message);
            res.status(500).json({ message: "Error interno del servidor." });
        }
    };
