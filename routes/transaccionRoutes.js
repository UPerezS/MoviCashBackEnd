const express = require('express');
const router = express.Router();

const transaccionController = require("../controllers/transaccionController"); 

// Ruta para actualizar el estado de una transacción al rechazar o aceptar
router.patch("/AR/:IdComprobante/accion", transaccionController.updateEstadoTransaccion);

module.exports = router;
