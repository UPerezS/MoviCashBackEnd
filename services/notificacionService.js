const Notificacion = require('../models/notificacion');

async function guardarNotificacion(RFCOperador, mensaje, transaccionId, tipoNotificacion = 'General') {
    const nuevaNotificacion = new Notificacion({
        RFCOperador,
        mensaje,
        transaccionId,
        tipoNotificacion
    });
    return nuevaNotificacion.save();  
}

//Obtener todas las notificaciones 
async function obtenerNotificaciones(RFCOperador) {
    try {
        return await Notificacion.find({ 
            RFCOperador, 
            estado: 'Pendiente'
        }).select('mensaje fecha tipoNotificacion');
    } catch (error) {
        throw error;
    }
}

async function marcarNotificacionesComoEnviadas(RFCOperador) {
    const notificacionesPendientes = await Notificacion.find({ 
        RFCOperador, 
        estado: 'Pendiente'
    });

    if (notificacionesPendientes.length === 0) {
        return { sinNotificaciones: true };
    }

    const resultado = await Notificacion.updateMany(
        { 
            RFCOperador, 
            estado: 'Pendiente'
        },
        { $set: { estado: 'Leída' } }
    );

    return { 
        sinNotificaciones: false,
        actualizadas: resultado.modifiedCount 
    };
}

// Función para notificar operadores sobre nuevas solicitudes de transacción
async function notificarOperadoresSolicitud(operadores, transaccion) {
    if (!operadores || operadores.length === 0) {
        console.log('No hay operadores para notificar');
        return;
    }
    
    try {
        // Determinar si el monto debe ser ocultado (> 20,000)
        const montoMostrado = transaccion.Monto > 20000 ? "Monto Confidencial" : transaccion.Monto;
        
        const mensaje = `Nueva solicitud de transacción ${transaccion.IdComprobante} de ${transaccion.NombreCompletoOrdenante} a ${transaccion.NombreCompletoBeneficiario} por ${montoMostrado}.`;
        
        // Crear una notificación para cada operador
        const promesas = operadores.map(operador => 
            guardarNotificacion(
                operador.RFC, 
                mensaje, 
                transaccion._id,
                'Solicitu de Transaccion'
            )
        );
        
        await Promise.all(promesas);
        console.log(`Se enviaron notificaciones a ${operadores.length} operadores sobre la transacción ${transaccion.IdComprobante}`);
    } catch (error) {
        console.error('Error al notificar operadores:', error);
    }
}

module.exports = {
    guardarNotificacion,
    obtenerNotificaciones,
    marcarNotificacionesComoEnviadas,
    
    // Solicitud
    notificarOperadoresSolicitud
};