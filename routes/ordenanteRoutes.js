const express = require('express');
const router = express.Router();

// Se importa el controlador para poder tener acceso a sus metodos
const operadorController = require("../controllers/ordenanteController");

router.get("/getAllOrdenantes", operadorController.getAllOrdenantes);

router.delete("/deleteOrdenante/:RFCOrdenante", operadorController.deleteOrdenante);

router.put("/updateOrdenante/:RFCOrdenante", operadorController.updateOrdenante);

module.exports = router;
