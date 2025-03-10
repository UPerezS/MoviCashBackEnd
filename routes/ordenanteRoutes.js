const express = require('express');
const router = express.Router();

// Se importa el controlador para poder tener acceso a sus metodos
const ordenanteController = require("../controllers/ordenanteController");
const { validateRegisterOrdenante } = require("../middlewares/ordenanteMiddleware");

router.get("/getAllOrdenantes", ordenanteController.getAllOrdenantes); // ✅ Importación correcta

router.get("/getOrdenanteByRFC/:RFCOrdenante", ordenanteController.getOrdenanteByRFC); // Obtener ordenante por RFC

router.get("/getOrdenanteByApellido", ordenanteController.getOrdenanteByApellido); // Obtener Ordenante por Apellido

router.delete("/deleteOrdenante/:RFCOrdenante", ordenanteController.deleteOrdenante); // ✅ Importación correcta

router.post("/createOrdenante", validateRegisterOrdenante ,ordenanteController.createOrdenante); // ✅ Importación correcta

router.put("/updateOrdenante/:RFCOrdenante", ordenanteController.updateOrdenante); // ✅ Importación correcta

module.exports = router;
