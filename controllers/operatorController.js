const operatorService = require("../services/operatorService");
const { validationResult } = require("express-validator");
const handleHttpError = require("../utils/handleHttpError");

// Obtener operador por RFC
exports.getOperatorByRFC = async (req, res) => {
  try {
    const { RFC } = req.params;
    const operator = await operatorService.getOperatorByRFC(RFC);
    
    if (!operator) {
      return res.status(404).json({ error: "Operador no encontrado" });
    }

    res.status(200).json(operator);
  } catch (error) {
    handleHttpError(res, "Error al obtener el operador", 500, error);
  }
};

// Mostrar todos los operadores
exports.getAllOperators = async (req, res) => {
  try {
    const operators = await operatorService.getAllOperators(); // Obtener todos los operadores

    if (!operators || operators.length === 0) {
      return res.status(404).json({ message: "No se encontraron operadores." });
    }

    res.status(200).json({ message: "Operadores encontrados.", data: operators });
  } catch (error) {
    console.error("Error al obtener los operadores: ", error);
    handleHttpError(res, "Error al obtener los operadores", 500, error);
  }
};

// Eliminar operador por RFC
exports.deleteOperator = async (req, res) => {
  try {
    const { RFC } = req.params;
    
    // Buscar el operador antes de eliminarlo
    const operator = await operatorService.getOperatorByRFC(RFC);
    if (!operator) {
      return res.status(404).json({ message: "Operador no encontrado." });
    }

    // Eliminar el operador
    await operatorService.deleteOperator(RFC);
    res.status(200).json({ message: "Operador eliminado con éxito." });

  } catch (error) {
    console.error("Error al eliminar el operador: ", error);
    handleHttpError(res, "Error al eliminar el operador", 500, error);
  }
};

// Actualizar datos del operador
exports.updateOperator = async (req, res) => {
  try {
    // Validar los datos con express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleHttpError(res, "Error de validación", 400, errors.array());
    }

    const { RFC } = req.params;
    const updateData = req.body;

    if (updateData.Password) {
      updateData.Password = await encript(updateData.Password);
    }

    updateData.FechaUltimaModificacion = new Date();
    const updatedOperator = await operatorService.updateOperator(RFC, updateData);

    if (!updatedOperator) {
      return res.status(404).json({ error: "Operador no encontrado" });
    }

    res.status(200).json({ message: "Operador actualizado", operator: updatedOperator });
  } catch (error) {
    handleHttpError(res, "Error al actualizar el operador", 500, error);
  }
};