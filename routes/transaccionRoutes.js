const express = require('express');
const router = express.Router();

const transaccionController = require("../controllers/transaccionController"); 

// Ruta para actualizar el estado de una transacción al rechazar o aceptar
router.put("/AR/:IdComprobante/accion", transaccionController.updateEstadoTransaccion);



module.exports = router;
