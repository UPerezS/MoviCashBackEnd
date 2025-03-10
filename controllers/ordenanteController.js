const Ordenante = require("../models/ordenante");
const matchedData = require('express-validator');
const ordenanteservice = require('../services/ordenanteService');

// Obtener todos los ordenantes
exports.getAllOrdenantes = async (req, res) => {
    try {
        const ordenantes = await Ordenante.find();
        
        if (ordenantes.length === 0) {
            return res.status(404).json({ message: "No se encontraron ordenantes." });
        }

        res.status(200).json({ message: "Ordenantes encontrados.", data: ordenantes });
    } catch (error) {
        // En caso de error en la consulta, se captura y responde con error 500
        console.error("Error al obtener los ordenantes: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};
//crear nuevo ordenante

exports.createOrdenante = async (req, res) => {
    try {
    
        const body = matchedData(req);
    
        // Verificar si el RFC ya existe
        const existeOrdenante = await Ordenante.findOne({ RFC });
        if (existeOrdenante) {
            return res.status(400).json({ message: "El RFC ya está registrado." });
        }

        const newOrdenente = await ordenanteservice.createOrdenante(body);

        // Responder con éxito
        res.status(201).json({
            message: "Ordenante registrado exitosamente",
            data: nuevoOrdenante,
            newOrdenente
        });
    } catch (error) {
        console.error("Error al crear el ordenante: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};
// Eliminar un ordenante
exports.deleteOrdenante = async (req, res) => {
    const { RFCOrdenante } = req.params;  // Obtenemos el RFC del ordenante desde los parámetros de la ruta
    
    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante }, { Rol: 1 });
        
        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        // Si el ordenante es válido y tiene el rol "Ordenante", se procede a eliminarlo
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
    const { RFCOrdenante } = req.params;  // Obtenemos el RFC del ordenante desde los parámetros de la ruta
    
    try {
        const ordenante = await Ordenante.findOne({ RFCOrdenante }, { Rol: 1 });

        if (!ordenante) {
            return res.status(404).json({ message: "Ordenante no encontrado." });
        }

        if (ordenante.Rol === "Ordenante") {
            // Extraemos los datos a actualizar desde el cuerpo de la solicitud
            const {
                RFCOrdenante, 
                NombreOrdenante,
                ApPaterno,
                ApMaterno,
                Sexo,
                FechaNacimiento,
                NumeroCuenta,
                Saldo,
                Estado,
                FechaRegistro,
                Telefono,
                Direccion
            } = req.body;

            // Actualizamos el documento con los nuevos valores
            await Ordenante.updateOne(
                { RFCOrdenante }, 
                { 
                    $set: {
                        "NombreOrdenante": NombreOrdenante,
                        "ApPaterno": ApPaterno,
                        "ApMaterno": ApMaterno,
                        "Sexo": Sexo,
                        "FechaNacimiento": new Date(FechaNacimiento), // Convertimos la fecha a formato Date
                        "Direccion": {
                            "NumeroInterior": NumeroInterior,
                            "NumeroExterior": NumeroExterior,
                            "Calle": Calle,
                            "Colonia": Colonia,
                            "Ciudad": Ciudad
                        },
                        "Telefono": [
                            {
                                "Lada": Lada,
                                "Numero": Numero
                            }
                        ],
                        "Estado": Estado,
                        "FechaUltimaModificacion": new Date() 
                    }
                }
            );

            res.status(200).json({ message: "Ordenante actualizado con éxito." });
        } else {
            console.error("No es ordenante.");
            res.status(403).json({ message: "no es ordenante." });
        }
    } catch (error) {
        console.log("Error al actualizar ordenante: ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};
