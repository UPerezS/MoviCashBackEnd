const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionRequestController');
const transaccionMiddleware = require('../middlewares/transaccionRequestMiddleware');

// Se aplica middlewares de autenticación y autorización a todas las rutas
router.use(transaccionMiddleware.verificarTokenTransaccion);
router.use(transaccionMiddleware.esOperadorTransaccion);

// Solicitar una transacción
router.post('/solicitar', transaccionMiddleware.validarDatosTransaccion,transaccionMiddleware.validarCuentasYPermisos,transaccionController.solicitarTransaccion);

// Obtener transacciones por estado
router.get('/estado/:estado', transaccionMiddleware.validarEstadoTransaccion,transaccionController.obtenerTransaccionesPorEstado);

// Obtener todas las transacciones
router.get('/obtenerTranssacciones', transaccionController.obtenerTransacciones);

// Obtener una transacción por su ID
router.get('/obtenerTranssaccionId/:id', transaccionController.obtenerTransaccionPorId);

module.exports = router;

