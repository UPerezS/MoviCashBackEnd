const Ordenante = require("../models/ordenante");
const { matchedData } = require("express-validator");
const OrdenanteService = require('../services/ordenanteService');
const handleHttpError = require('../utils/handleHttpError');


exports.getOrdenanteByRFC = async (req, res) => {
    const { RFCOrdenante } = req.params;

    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        return res.status(200).json({ message: "Ordenante encontrado.", ordenante });

    } catch (error) {
        handleHttpError(res, "Error al Obtener el Ordenante por RFC", 500, error);
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

        return res.status(200).json({ message: "Ordenante(s) encontrado(s).", ordenantes });

    } catch (error) {
        console.error("Error al obtener el ordenante: ", error);
        handleHttpError(res, "Error al Obtener el Ordenante por Apellido", 500, error);
    }
};

exports.getAllOrdenantes = async (req, res) => {
    try {
        const ordenantes = await Ordenante.find();

        if (ordenantes.length === 0) {
            return res.status(404).json({ message: "No se encontraron ordenantes." });
        }

        return res.status(200).json({ message: "Ordenantes encontrados.", ordenantes });
    } catch (error) {
        console.error("Error al obtener los ordenantes: ", error);
        handleHttpError(res, "Error al Obtener Todos los Ordenantes", 500, error);
    }
};

exports.createOrdenante = async (req, res) => {
    try {

        const userId = req.user._id;
        const body = matchedData(req); // Obtener los datos del cuerpo de la solicitud
        console.log(userId);

        const nuevoOrdenante = await OrdenanteService.createOrdenante(userId, body);

        // const nuevoOrdenante = new Ordenante(body);
        // await nuevoOrdenante.save();

        console.log("Ordenante creado con éxito.");
        res.status(201).json({ message: "Ordenante creado con éxito.", nuevoOrdenante });

    } catch (error) {
        console.error("Error al crear el ordenante:", error);
        handleHttpError(res, "Error al Crear el Ordenante", 500, error);
        console.log()
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
        return res.status(200).json({ message: "Ordenante eliminado con éxito.", ordenante });

    } catch (error) {
        console.error("Error al eliminar el ordenante: ", error);
        handleHttpError(res, "Error al Eliminar el Ordenante", 500, error);
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

        return res.status(200).json({ message: "Ordenante actualizado correctamente.", result });

    } catch (error) {
        console.error("Error al actualizar el ordenante: ", error);
        handleHttpError(res, "Error al actualizar el Ordenante", 500, error);
    }
};


//Actulizar el estado del ordenante 
    exports.updateEstadoOrdenante = async (req, res) => {
        const { RFCOrdenante } = req.params;
        const { Estado } = req.body;

        try {
            const ordenante = await Ordenante.findOne({RFCOrdenante });
            if (!ordenante) {return res.status(404).json({ error: 'Ordenante no encontrado.' });
            }
            
            if (ordenante.Estado === Estado) {
                return res.status(400).json({ error: `El estado ya está actulizado a: "${Estado}".` });
              }
            
              ordenante.Estado = Estado;
              await ordenante.save();
          
              res.status(200).json({
                message: `Estado del ordenante actualizado a "${Estado}".`,
                data: ordenante
              });

            } catch (error) {
                console.error('Error al actualizar el estado del ordenante:', error.message);
                handleHttpError(res, 'Error de actualizar ordenante', 500, error.message);
              }
            };
