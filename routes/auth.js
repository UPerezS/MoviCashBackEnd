const express = require("express");
const router = express.Router();

const { validateRegister, validateLogin } = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

// Ruta para registrar un usuario
router.post("/register", validateRegister, authController.register);

// Ruta para iniciar sesión
router.post("/login", validateLogin, authController.login);

module.exports = router;