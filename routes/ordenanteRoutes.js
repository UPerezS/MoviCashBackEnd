const express = require('express');
const router = express.Router();
const { validateRegisterOrdenante } = require('../middlewares/ordenanteMiddleware');
// Se importa el controlador para poder tener acceso a sus metodos
const operadorController = require("../controllers/ordenanteController")

router.post("/createOrdenante", validateRegisterOrdenante, operadorController.createOrdenante);

router.get("/getAllOrdenantes", operadorController.getAllOrdenantes);

router.delete("/deleteOrdenante/:RFCOrdenante", operadorController.deleteOrdenante);

router.put("/updateOrdenante/:RFCOrdenante", operadorController.updateOrdenante);

module.exports = router;
