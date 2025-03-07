const express = require("express");
const router = express.Router();

const { validateRegister, validateLogin } = require("../middlewares/authValidator");
const authController = require("../controllers/authController");

// Ruta para registrar un usuario
router.post("/register", validateRegister, authController.register);

// Ruta para iniciar sesión
router.post("/login", validateLogin, authController.login);

// Verificar de codigo enviado al usuario
router.post('/verificar-codigo', authController.verificarCodigoYGenerarToken);

router.post("/recover-password", authController.recoverPassword);

router.post("/update-password", authController.updatePassword);

module.exports = router;