const Ordenante = require("../models/ordenante");
const { matchedData } = require("express-validator"); // ✅ Importación correcta
const OrdenanteService = require('../services/ordenanteService'); // Importar el servicio


// Obtener todos los ordenantes ✅
exports.getAllOrdenantes = async (req, res) => {
    try {
        // Buscamos todos los ordenantes en la base de datos
        const ordenantes = await Ordenante.find();

        // Si no se encuentran ordenantes, respondemos con un mensaje adecuado
        if (ordenantes.length === 0) {
            return res.status(404).json({ message: "No se encontraron ordenantes." });
        }

        // Si se encuentran ordenantes, los retornamos con un mensaje de éxito
        return res.status(200).json({ message: "Ordenantes encontrados.", data: ordenantes });
    } catch (error) {
        // En caso de error, se captura y se responde con el mensaje de error
        console.error("Error al obtener los ordenantes: ", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};



// Crear un nuevo ordenante ✅
exports.createOrdenante = async (req, res) => {
    try {
        const body = matchedData(req); // Obtener los datos del cuerpo de la solicitud

    
        // Crear y guardar el nuevo ordenante en la base de datos
        const nuevoOrdenante = new Ordenante(body);
        await nuevoOrdenante.save();

        console.log("Ordenante creado con éxito.");
        res.status(201).json({ message: "Ordenante creado con éxito.", data: nuevoOrdenante });

    } catch (error) {
        console.error("Error al crear el ordenante:", error);
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};


// Eliminar un ordenante ✅
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
        return res.status(200).json({ message: "Ordenante eliminado con éxito." });

    } catch (error) {
        // En caso de error, se captura y se responde con el mensaje de error
        console.error("Error al eliminar el ordenante: ", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};


// Actualizar datos de un ordenante
exports.updateOrdenante = async (req, res) => {
    const { RFCOrdenante } = req.params; // Obtenemos el RFC del ordenante desde los parámetros de la URL
    const ordenanteData = req.body; // Obtenemos los datos del ordenante desde el cuerpo de la solicitud

    try {
        // Llamar al servicio para actualizar el ordenante
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
