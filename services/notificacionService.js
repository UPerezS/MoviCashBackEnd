const Notificacion = require('../models/notificacion');

// Función para guardar una notificación en MongoDB
async function guardarNotificacion(RFCOperador, mensaje, transaccionId) {
    const nuevaNotificacion = new Notificacion({
        RFCOperador,
        mensaje,
        transaccionId
    });
    return nuevaNotificacion.save();  
}

// Función para obtener las notificaciones pendientes de un operador
async function obtenerNotificaciones(RFCOperador) {
    try {
        return await Notificacion.find({ RFCOperador, estado: 'Pendiente' })
        .select('mensaje fecha');
    } catch (error) {
        throw error;
    }
}

// Función para marcar las notificaciones como "Leídas"
async function marcarNotificacionesComoEnviadas(req, res) {
    
    const { RFCOperador } = req.params; 

   
        const notificacionesPendientes = await Notificacion.find({ RFCOperador, estado: 'Pendiente' });

        if (notificacionesPendientes.length === 0) {
            return res.status(200).json({ message: 'No tienes notificaciones pendientes.' });
        }

        await Notificacion.updateMany(
            { RFCOperador, estado: 'Pendiente' },
            { $set: { estado: 'Leída' } }
        );
    }
        

module.exports = {
    guardarNotificacion,
    obtenerNotificaciones,
    marcarNotificacionesComoEnviadas
};
