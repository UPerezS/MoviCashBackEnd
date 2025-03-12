const NotificacionService = require('../services/notificacionService');

// Función para obtener las notificaciones pendientes de un operador
exports.obtenerNotificaciones = async (req, res) => {
    const { RFCOperador } = req.params;

    try {
        const notificaciones = await NotificacionService.obtenerNotificaciones(RFCOperador);

        if (notificaciones.length === 0) {
            return res.status(200).json({ message: 'No tienes notificaciones pendientes.' });
        }

        res.status(200).json({ notificaciones });
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error al obtener notificaciones.' });
    }
};

// Función para marcar las notificaciones como "enviado"
exports.marcarNotificacionesComoEnviadas = async (req, res) => {
    try {
        await NotificacionService.marcarNotificacionesComoEnviadas(req, res);
        res.status(200).json({ message: 'Notificaciones leídas, ya has visto todas las notificaciones, estás al día.' });
    } catch (error) {
        console.error('Error al marcar notificaciones como enviadas:', error);
        res.status(500).json({ message: 'Error al actualizar el estado de las notificaciones.' });
    }
};
