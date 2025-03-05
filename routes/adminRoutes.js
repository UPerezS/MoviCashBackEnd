const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/roleMiddleware');
const adminController = require('../controllers/adminController');

// Ruta para obtener a todos los administradores
router.get('/getAllAdmin', authMiddleware, checkRol(['Admin']), adminController.getAllAdmin);

// Ruta para eliminar a un administrador
router.delete('/deleteAdmin/:RFC', authMiddleware, checkRol(['Admin']), adminController.deleteAdmin);

// Ruta para actualizar a un administrador
router.put('/updateAdmin/:RFC', authMiddleware, checkRol(['Admin']), adminController.updateAdmin);

module.exports = router;