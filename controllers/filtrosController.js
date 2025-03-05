const Personal = require("../models/personal");
const Transaccion = require("../models/transaccion");

// * Filtro de usuarios
exports.getFilterUsers = async (req, res) => {
    try {
        const { rol, FechaCreacion } = req.body; // Obtener rol o fecha

        if (!rol && !FechaCreacion) { // Si no hay rol ni fechas
            return res.status(400).json(
                { message: "Debe proporcionar un rol o un rango de fechas válido." });
        }
        
        let filter = {};

        if (rol) { 
            filter.Rol = rol; // Se agrega el rol al filtro
        }

        if (FechaCreacion) { 
            if (typeof FechaCreacion === "string") {
                filter.FechaCreacion = new Date(FechaCreacion);
            } else {
                return res.status(400).json({ message: "Formato de fecha inválido." });
            }
        }

        const usuarios = await Personal.find(filter); 

        if (!usuarios.length) {
            return res.status(404).json(
                { message: "No se encontraron usuarios con los criterios especificados." }); // Si no hay usuarios, se envía un error
        }

        res.status(200).json({
            message: "Usuarios encontrados.",
            data: usuarios 
        }); 

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// * Transacción
exports.getFilterTransactions = async (req, res) => { 
    try {
        const { Fecha } = req.body; // Se obtiene la fecha

        if (!Fecha) {
            return res.status(400).json({ message: "Debe proporcionar una fecha." }); // Si no hay fecha, se envía un error
        }

        let filter = { Fecha: new Date(Fecha) }; // Se crea el filtro

        if (Fecha) { 
            if (typeof Fecha === "string") {
                filter.Fecha = new Date(Fecha);
            } else {
                return res.status(400).json({ message: "Formato de fecha inválido." });
            }
        }

        const transacciones = await Transaccion.find(filter); // Se buscan las transacciones

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