const express = require('express');
const router = express.Router();

const adminController = require("../controllers/adminController"); // Se importa el controlador para poder tener acceso a sus metodos

// Ruta para obtener a todos los administradores
router.get("/getAllAdmin", adminController.getAllAdmin);

// Ruta para eliminar a un administrador
router.delete("/deleteAdmin/:RFC", adminController.deleteAdmin);

// Ruta para actualizar a un administrador
router.put("/updateAdmin/:RFC", adminController.updateAdmin);

module.exports = router