const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');

// Ruta para obtener las notificaciones pendientes de un operador
router.get('/:RFCOperador', notificacionController.obtenerNotificaciones);

// Ruta para marcar las notificaciones como "leídas"
router.patch('/:RFCOperador/leidas', notificacionController.marcarNotificacionesComoEnviadas);



module.exports = router;
