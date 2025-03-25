const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');

// Rutas
router.get('/:RFCOperador', notificacionController.obtenerNotificaciones);
router.patch('/:RFCOperador/leidas', notificacionController.marcarNotificacionesComoEnviadas);

module.exports = router;