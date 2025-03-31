const express = require('express');
const router = express.Router();
const filtrosController = require("../controllers/filtrosController");

const authMiddleware = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/roleMiddleware');

// Ruta para obtener todos los usuarios 
router.use("/getAllUsers", authMiddleware, checkRol(['Admin']), filtrosController.getAllUsers); 
 
// Ruta para obtener usuarios por filtro
router.get("/filterUsers", authMiddleware, checkRol(['Admin']), filtrosController.filterUsers);

// Ruta para obtener transacciones por fecha
router.get("/filterTransactions", filtrosController.filterTransactions);

module.exports = router