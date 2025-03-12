const express = require('express');
const router = express.Router();
// Se importa el controlador para poder tener acceso a sus metodos
const ordenanteController = require("../controllers/ordenanteController");
const { validateRegisterOrdenante } = require("../middlewares/ordenanteMiddleware");

router.get("/getAllOrdenantes", ordenanteController.getAllOrdenantes);

router.get("/getOrdenanteByRFC/:RFCOrdenante", ordenanteController.getOrdenanteByRFC);

router.get("/getOrdenanteByApellido/:ApPaterno", ordenanteController.getOrdenanteByApellido);

router.delete("/deleteOrdenante/:RFCOrdenante", ordenanteController.deleteOrdenante);

router.post("/createOrdenante", validateRegisterOrdenante ,ordenanteController.createOrdenante);

router.put("/updateOrdenante/:RFCOrdenante", ordenanteController.updateOrdenante);

module.exports = router;
