const express = require('express');
const router = express.Router();

// Se importa el controlador para poder tener acceso a sus metodos
const operadorController = require("../controllers/ordenanteController");
const adminController = require("../controllers/ordenanteController");

// Obtener a todos los ordenantes
router.get("/getAllOrdenantes", operadorController.getAllOrdenantes);

// Eliminar un ordenante
router.delete("/deleteOrdenante/:RFCOrdenante", operadorController.deleteOrdenante);

// Actualizar datos de un ordenante
router.put("/updateOrdenante/:RFCOrdenante", operadorController.updateOrdenante);

module.exports = router;
