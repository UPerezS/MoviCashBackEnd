const express = require("express");
const router = express.Router();

const { authMiddleware, validateLogin } = require("../middlewares/authMiddleware");
const operatorController = require("../controllers/operatorController");

// Ruta para obtener un operador por RFC
router.get("/:RFC", operatorController.getOperatorByRFC);

// Ruta para obtener todos los operadores
router.get("/", operatorController.getAllOperators);

// Ruta para actualizar datos del operador
router.put("/:RFC", operatorController.updateOperator);

// Ruta para eliminar un operador por RFC
router.delete("/:RFC", operatorController.deleteOperator);

module.exports = router;
