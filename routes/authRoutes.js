const express = require("express");
const router = express.Router();

const { 
    validateRegister, 
    validateLogin, 
    validateCodigo, 
    validateNewPassword
} = require("../middlewares/authValidator");

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Ruta para registrar un usuario
router.post("/registrar", validateRegister, authController.registrar);

// Ruta para iniciar sesión
router.post("/login", validateLogin, authController.login);

// Verificar de codigo enviado al usuario
router.post('/verificar-codigo', validateCodigo, authController.verificarCodigoYGenerarToken);

// Recuperar contraseña con correo electronico
router.post("/recover-password", authController.recoverPassword);

router.post("/update-password", validateNewPassword, authController.updatePassword);

router.put("/block-user/:RFC", authMiddleware, authController.blockUser);

router.put("/unblock-user/:RFC", authMiddleware, authController.unblockUser);

module.exports = router;