const express = require("express");
const router = express.Router();

const { validateRegister } = require("../middlewares/authMiddleware");
const registerController = require("../controllers/registerController");

// Ruta para registrar un operador / administrador
router.post("/register", validateRegister, registerController.register);

module.exports = router;