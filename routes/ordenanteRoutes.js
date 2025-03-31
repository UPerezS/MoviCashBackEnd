const express = require('express');
const router = express.Router();
// Se importa el controlador para poder tener acceso a sus metodos
const ordenanteController = require("../controllers/ordenanteController");
const { validateRegisterOrdenante } = require("../middlewares/ordenanteMiddleware");
const authMiddleware = require('../middlewares/authMiddleware');
const { validateRegisterOrdenante1 } = require("../middlewares/ordenanteMiddleware");
const csvController = require("../controllers/csvController");
const uploadCsv = require("../middlewares/csvMiddleware");


router.get("/getAllOrdenantes", ordenanteController.getAllOrdenantes);

router.get("/getOrdenanteByRFC/:RFCOrdenante", ordenanteController.getOrdenanteByRFC);

router.get("/getOrdenanteByApellido/:ApPaterno", ordenanteController.getOrdenanteByApellido);

router.delete("/deleteOrdenante/:RFCOrdenante", ordenanteController.deleteOrdenante);

router.post("/createOrdenante", authMiddleware, validateRegisterOrdenante ,ordenanteController.createOrdenante);

router.put("/updateOrdenante/:RFCOrdenante", ordenanteController.updateOrdenante);

router.patch('/ordenantes/:RFCOrdenante/estado', ordenanteController.updateEstadoOrdenante);

router.post('/bulkOrdenante', uploadCsv.upload,csvController.insertBulk);

module.exports = router;
