const express = require('express');
const router = express.Router();
const filtrosController = require("../controllers/filtrosController");

// Ruta para obtener usuarios por filtro
router.get("/getFilterUsers", filtrosController.getFilterUsers);

// Ruta para obtener transacciones por fecha
router.get("/getFilterTransaction", filtrosController.getFilterTransaction);

module.exports = router