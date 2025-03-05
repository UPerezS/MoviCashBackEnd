const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const transaccionMiddleware = require('../middlewares/transaccionMiddleware');

// Usar tu propio middleware
router.use(transaccionMiddleware.verificarTokenTransaccion);
router.use(transaccionMiddleware.esOperadorTransaccion);

// Solicitar una transacción
router.post('/solicitar', transaccionController.solicitarTransaccion);

module.exports = router;