const mongoose = require("mongoose"); // Asegúrate de importar mongoose
const Personal = require("../models/personal");
const Transaccion = require("../models/transaccion");
const Ordenante = require("../models/ordenante");
const { verifyToken } = require("../utils/handleJwt");

// * Filtro de usuarios
exports.filterUsers = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token no proporcionado o formato incorrecto." });
        }
        const token = authHeader.split(" ")[1];

        const dataToken = await verifyToken(token);
        if (!dataToken || !dataToken._id) {
            console.log("Token decodificado:", dataToken);
            return res.status(401).json({ message: "Token inválido o usuario sin ID." });
        }

        const myId = mongoose.Types.ObjectId.isValid(dataToken._id) 
            ? new mongoose.Types.ObjectId(dataToken._id) 
            : null;

        if (!myId) {
            return res.status(400).json({ message: "ID de usuario no válido." });
        }

        console.log("ID del usuario autenticado:", myId);

        const { rol, FechaCreacion, RFCOrdenante } = req.query;

        if (!rol && !FechaCreacion && !RFCOrdenante) {
            return res.status(400).json({
                message: "Debe proporcionar un rol, un rango de fechas válido o un RFC de ordenante."
            });
        }

        let filter = { _id: { $ne: myId } };

        if (rol) {
            filter.Rol = rol;
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
            }
        }

        let usuarios = [];
        let ordenantes = [];

        if (RFCOrdenante) {
            ordenantes = await Ordenante.find({ RFCOrdenante });
            if (!ordenantes.length) {
                return res.status(404).json({
                    message: "No se encontraron ordenantes con el RFC especificado."
                });
            }
        } else {
            usuarios = await Personal.find(filter);
            if (!usuarios.length) {
                return res.status(404).json({
                    message: "No se encontraron usuarios con los criterios especificados."
                });
            }
        }

        return res.status(200).json({
            message: "Usuarios encontrados.",
            data: usuarios.length ? usuarios : ordenantes
        });

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};

// * Filtro de transacciones
exports.filterTransactions = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token no proporcionado o formato incorrecto." });
        }
        const token = authHeader.split(" ")[1];

        const dataToken = await verifyToken(token);
        if (!dataToken || !dataToken._id) {
            return res.status(401).json({ message: "Token inválido o usuario sin ID." });
        }

        const myId = mongoose.Types.ObjectId.isValid(dataToken._id) 
            ? new mongoose.Types.ObjectId(dataToken._id) 
            : null;

        if (!myId) {
            return res.status(400).json({ message: "ID de usuario no válido." });
        }

        const usuario = await Personal.findById(myId);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const { Fecha } = req.query;

        if (!Fecha) {
            return res.status(400).json({ message: "Debe proporcionar una fecha." });
        }

        let filter = {}; 

        if (typeof Fecha === "string") {
            if (typeof Fecha === "string") {
                if (Fecha.includes("T")) {
                    filter.Fecha = new Date(Fecha);
                } else {
                    const fechaInicio = new Date(`${Fecha}T00:00:00.000Z`);
                    const fechaFin = new Date(`${Fecha}T23:59:59.999Z`);
                    filter.Fecha = { $gte: fechaInicio, $lte: fechaFin };
                }
            }
        }

        if (usuario.Rol === "Operador") {
            filter.RFCOperador = { $ne: usuario.RFC }; 
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
};
