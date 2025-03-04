const Personal = require("../models/personal");
const Transaccion = require("../models/transaccion");

// * Filtro de usuarios
exports.getFilterUsers = async (req, res) => {
    try {
        const { rol, FechaCreacion } = req.body; // Obtener rol y fecha

        if (!rol && !FechaCreacion) {
            return res.status(400).json({ message: "Debe proporcionar un rol o un rango de fechas." });
        }

        let filter = {}; // Objeto para filtrar

        if (rol) { 
            filter.Rol = rol; // Filtrar por rol
        }

        if (FechaCreacion && FechaCreacion.start && FechaCreacion.end) { // Filtrar por rango de fechas
            filter.FechaCreacion = { 
                $gte: new Date(FechaCreacion.start), 
                $lte: new Date(FechaCreacion.end) 
            };
        }

        const usuarios = await Personal.find(filter); 

        if (!usuarios.length) {
            return res.status(404).json(
                { message: "No se encontraron usuarios con los criterios especificados." }); // Si no hay usuarios, se envía un error
        }

        res.status(200).json({  // Se envía la respuesta
            message: "Usuarios encontrados.",
            data: usuarios 
        }); 

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// * Transacción
exports.getFilteredTransactions = async (req, res) => { 
    try {
        const { Fecha } = req.body; // Se obtiene la fecha

        if (!Fecha) {
            return res.status(400).json({ message: "Debe proporcionar una fecha." }); // Si no hay fecha, se envía un error
        }

        let filter = { Fecha: new Date(Fecha) }; // Se crea el filtro

        if (Fecha && Fecha.start && Fecha.end) { // Filtrar por rango de fechas
            filter.Fecha = { 
                $gte: new Date(Fecha.start), 
                $lte: new Date(Fecha.end) 
            };
        }

        const transacciones = await Transaccion.find(filter); //Personal", PersonalSchema, "Personal

        if (!transacciones.length) {
            return res.status(404).json({ message: "No se encontraron transacciones con la fecha especificada." });
        }

        res.status(200).json({ 
            message: "Transacciones encontradas.",
            data: transacciones
        });

    } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}