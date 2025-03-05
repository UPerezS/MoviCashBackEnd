const Personal = require("../models/personal");
const Transaccion = require("../models/transaccion");
const Ordenante = require("../models/ordenante");
const { verifyToken } = require("../utils/handleJwt");

// * Filtro de usuarios
exports.getFilterUsers = async (req, res) => {
    try {
        const { rol, FechaCreacion, RFCOrdenante } = req.body; 
        const myRFC = req.user ? req.user.RFC : null; 
        const dataToken = await verifyToken(token);

        if (!rol && !FechaCreacion && !RFCOrdenante) { 
            return res.status(400).json(
                { message: "Debe proporcionar un rol, un rango de fechas válido o un RFC de ordenante." });
        }
        
        let filter = {};

        if (rol) { 
            filter.Rol = rol;
            // Utilizar el datatoken para buscar administradores sin mostrar el usuario de la petición
            if (rol === "Admin") {
                if (dataToken.Rol !== "Admin") {
                    return res.status(401).json({ message: "No tienes permisos para realizar esta acción." });
                }
                filter.RFC = { $ne: myRFC };
            }
        }

        if (FechaCreacion) { 
            if (typeof FechaCreacion === "string") {
                if (FechaCreacion.includes("T")) {
                    filter.FechaCreacion = new Date(FechaCreacion);
                } else {
                    const fechaInicio = new Date(`${FechaCreacion}T00:00:00.000Z`);
                    const fechaFin = new Date(`${FechaCreacion}T23:59:59.999Z`);
                    
                    filter.FechaCreacion = { $gte: fechaInicio, $lte: fechaFin };
                }
            } else {
                return res.status(400).json({ message: "Formato de fecha inválido." });
            }
        }

        let usuarios = [];
        let ordenantes = [];

        if (RFCOrdenante) {
            ordenantes = await Ordenante.find({ RFCOrdenante });
            if (!ordenantes.length) {
                return res.status(404).json(
                    { message: "No se encontraron ordenantes con el RFC especificado." }); 
            }
        } else {
            usuarios = await Personal.find(filter);
            if (!usuarios.length) {
                return res.status(404).json(
                    { message: "No se encontraron usuarios con los criterios especificados." }); 
            }
        }

        res.status(200).json({
            message: "Usuarios encontrados.",
            data: usuarios.length ? usuarios : ordenantes 
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
            return res.status(400).json({ message: "Debe proporcionar una fecha." });
        }

        let filter = { Fecha: new Date(Fecha) };

        if (Fecha) { 
            if (typeof Fecha === "string") {
                if (Fecha.includes("T")) {
                    filter.Fecha = new Date(Fecha);
                } else {
                    const fechaInicio = new Date(`${Fecha}T00:00:00.000Z`);
                    const fechaFin = new Date(`${Fecha}T23:59:59.999Z`);
                    
                    filter.Fecha = { $gte: fechaInicio, $lte: fechaFin };
                }
            } else {
                return res.status(400).json({ message: "Formato de fecha inválido." });
            }
        }

        const transacciones = await Transaccion.find(filter);

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