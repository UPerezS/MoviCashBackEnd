const express = require('express');
const router = express.Router();

const transaccionController = require("../controllers/transaccionController"); 
const { validateUpdateEstadoTransaccion } = require("../middlewares/transaccionMilddleware");
const reportController = require("../controllers/reportController");

// Ruta para actualizar el estado de una transacción al rechazar o aceptar
router.patch("/AR/:IdComprobante/accion",validateUpdateEstadoTransaccion,transaccionController.updateEstadoTransaccion);
router.get("/report/:IdComprobante",reportController.getTransaccion);


module.exports = router;
