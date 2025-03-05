const Ordenante = require('../models/ordenante');

// Obtener ordenante por el RFC

exports.getOrdenanteByRFC = async (req, res) => {
    const { RFCOrdenante } = req.params;

    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        res.status(200).json({ message: "Ordenante encontrado.", data: ordenante });
    } catch (error) {
        console.error("Error al obtener el ordenante: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

// Obtener ordenante por el nombre

exports.getOrdenanteByName = async (req, res) => {
    const { NombreOrdenante } = req.params;

    try {
        const ordenante = await Ordenante.findOne({ NombreOrdenante });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        res.status(200).json({ message: "Ordenante encontrado.", data: ordenante });
    } catch (error) {
        console.error("Error al obtener el ordenante: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

// Obtener todos los ordenantes

exports.getAllOrdenantes = async (req, res) => {
    try {
        const ordenantes = await Ordenante.find({ Rol: "Ordenante" });

        if (ordenantes.length === 0) {
            return res.status(404).json({ message: "No se encontraron ordenantes." });
        }

        res.status(200).json({ message: "Ordenantes encontrados.", data: ordenantes });
    } catch (error) {
        console.error("Error al obtener los ordenantes: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

// Crear un nuevo ordenante

exports.createOrdenante = async (req, res) => {
    const ordenanteData = req.body;

    try {
        const newOrdenante = new Ordenante(ordenanteData);
        await newOrdenante.save();

        res.status(201).json({ message: "Ordenante creado con éxito.", data: newOrdenante });
    } catch (error) {
        console.error("Error al crear el ordenante: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// Eliminar un ordenante

exports.deleteOrdenante = async (req, res) => {
    const { RFCOrdenante } = req.params;

    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante }, { Rol: 1 });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        if (ordenante.Rol === "Ordenante") {
            await Ordenante.deleteOne({ RFCOrdenante });
            res.status(200).json({ message: "Ordenante eliminado con éxito." });
        } else {
            console.error("No es ordenante.");
            res.status(403).json({ message: "No es ordenante." });
        }
    } catch (error) {
        console.error("Error al eliminar el ordenante: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// Actualizar datos de un ordenante

exports.updateOrdenante = async (req, res) => {
    const { RFCOrdenante } = req.params;

    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante }, { Rol: 1 });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        if (ordenante.Rol === "Ordenante") {
            const ordenanteData = req.body;
            await Ordenante.updateOne({ RFCOrdenante }, ordenanteData);
            res.status(200).json({ message: "Ordenante actualizado con éxito." });
        } else {
            console.error("No es ordenante.");
            res.status(403).json({ message: "No es ordenante." });
        }
    } catch (error) {
        console.error("Error al actualizar el ordenante: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// Exportar los métodos del controlador

module.exports = {
    getOrdenanteByRFC,
    getOrdenanteByName,
    getAllOrdenantes,
    createOrdenante,
    deleteOrdenante,
    updateOrdenante
};  // Se exportan los métodos para poder ser utilizados en las rutas
