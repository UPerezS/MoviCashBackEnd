const express = require('express');
const router = express.Router();
const filtrosController = require("../controllers/filtrosController");

// Ruta para obtener usuarios por filtro
router.post("/getFilterUsers", filtrosController.getFilterUsers);

// Ruta para obtener transacciones por fecha
router.post("/getFilterTransaction", filtrosController.getFilteredTransactions);

module.exports = router