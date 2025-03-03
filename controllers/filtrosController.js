const Personal = require("../models/personal");

// * Filtro de usuarios
exports.getFilterUsers = async (req, res) => {
    const { rol, FechaCreacion } = req.query; // Obtener rol, fechaInicio y fechaFin de la consulta

    try {
        if (!rol && !FechaCreacion) { // Verificar si no se proporcionó un rol o un rango de fechas
            return res.status(400).json({ message: "Debe proporcionar un rol o un rango de fechas." });
        }

        let filter = {}; // Crear objeto para filtrar

        if (rol) { 
            filter.Rol = rol; // Filtrar por rol
        }

        if (fecha) { // Verificar si se proporcionaron fechas
            filter.FechaCreacion = FechaCreacion;
        }

        const usuarios = await Personal.find(filter); // Buscar usuarios en la base de datos

        if (usuarios.length === 0) { // Verificar si no se encontraron usuarios
            return res.status(404).json(
                { message: "No se encontraron usuarios con los criterios especificados." });
        }

        res.status(200).json({ // Devolver respuesta exitosa
            message: "Usuarios encontrados.",
            data: usuarios // Devolver usuarios encontrados
        });

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// * Transaccion

exports.getFilteredTransactions = async (req, res) => { 
    const { Transaccion } = req.query; // Se obtiene la fecha
    try {
        if (!Transaccion) { // Verificar si no se proporcionó un rol o un rango de fechas
            return res.status(400).json({ message: "Debe proporcionar una fecha." });
        }

        let filter = {};

        if (fecha) { // Verificar si se proporcionaron fechas
            filter.Fecha = Fecha;
        }

        const transacciones = await Transaccion.find(filter);

        if (transacciones.length === 0) { // Se verifica si no se encontraron transacciones.
            return res.status(404).json(
                { message: "No se encontraron transacciones con la fecha especificada." }); // Se devuelve un mensaje de error si no se encontraron transacciones.
        }

        res.status(200).json({ 
            message: "Transacciones encontradas.", // Se devuelve un mensaje de éxito si se encontraron transacciones.
            data: transacciones
        });

    } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        res.status(500).json({ message: "Error interno del servidor." }); // Se devuelve un mensaje de error si hubo un error en el servidor.
    }
};