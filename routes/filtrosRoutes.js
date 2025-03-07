const express = require('express');
const router = express.Router();
const filtrosController = require("../controllers/filtrosController");

const authMiddleware = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/roleMiddleware');

// Ruta para obtener usuarios por filtro
router.post("/filterUsers", authMiddleware, checkRol(['Admin']), filtrosController.filterUsers);

// Ruta para obtener transacciones por fecha
router.post("/filterTransactions", filtrosController.filterTransactions);

module.exports = router