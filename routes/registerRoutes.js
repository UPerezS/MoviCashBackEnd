const express = require("express");
const router = express.Router();

const { validateRegister } = require("../middlewares/authMiddleware");
const registerController = require("../controllers/registerController");
const activityController = require("../controllers/activityController"); // Asegúrate que esto esté bien

// Ruta para registrar un operador / administrador
router.post("/register", validateRegister, registerController.register);

// Ruta para registrar actividades
router.post("/registerActivity", activityController.registerActivity); // Esta ruta debe existir

module.exports = router;
