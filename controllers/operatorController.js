const operatorService = require("../services/operatorService");
const { validationResult } = require("express-validator");
const handleHttpError = require("../utils/handleHttpError");
const { hash } = require("../utils/handlePassword");
const Actividad = require("../models/actividad");
const Personal = require("../models/personal");

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
    const operators = await operatorService.getAllOperators();
    if (!operators || operators.length === 0) {
      return res.status(404).json({ message: "No se encontraron operadores." });
    }
    res.status(200).json({ message: "Operadores encontrados.", data: operators });
  } catch (error) {
    handleHttpError(res, "Error al obtener los operadores", 500, error);
  }
};

// Eliminar operador por RFC y registrar la actividad
exports.deleteOperator = async (req, res) => {
  try {
    const { RFC } = req.params;
    const operator = await operatorService.getOperatorByRFC(RFC);
    if (!operator) {
      return res.status(404).json({ message: "Operador no encontrado." });
    }

    // Registrar eliminación en la actividad
    await Actividad.updateOne(
      { RFC },
      {
        $push: {
          Acciones: {
            Accion: "Eliminación",
            Detalles: "Se ha eliminado el operador de manera permanente.",
            Fecha: new Date()
          }
        }
      },
      { upsert: true }
    );

    await operatorService.deleteOperator(RFC);
    res.status(200).json({ message: "Operador eliminado con éxito." });
  } catch (error) {
    handleHttpError(res, "Error al eliminar el operador", 500, error);
  }
};

// Actualizar operador y registrar cambios en Actividad
exports.updateOperator = async (req, res) => {

  const cambios = req.body;
  const campos = Object.keys(cambios);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleHttpError(res, "Error de validación", 400, errors.array());
    }

    let proyeccion = {};
    campos.forEach(campo => {
        proyeccion[campo] = 1;
    });
    proyeccion.Rol = 1;

    const { RFC } = req.params;
    let updateData = req.body;

    if (updateData.Password) {
      updateData.Password = await hash(updateData.Password);
    }

    const allowedFields = [
      'CorreoElectronico', 'Direccion', 'Telefono', 'Estado', 'Password'
    ];

    const fieldsToUpdate = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: "No hay campos válidos para actualizar." });
    }

    const existingOperator = await Personal.findOne({RFC}).select(proyeccion);
    if (!existingOperator) {
      return res.status(404).json({ error: "Operador no encontrado" });
    }

    const operador = await Personal.findOne({ RFC }).select("RFC Rol");
    if (!operador) {
      return res.status(404).json({ message: "Operador no encontrado." });
    }
    if (operador.Rol !== "Operador") {
      return res.status(403).json({ message: "El usuario no es un Operador." });
    }

    const modificaciones = {
      Anterior: existingOperator,
      Actualizado: fieldsToUpdate
    };

    await Actividad.updateOne(
      { RFC },
      {
        $push: {
          Acciones: {
            Accion: "Actualización",
            Detalles: `Se han actualizado los siguientes campos: ${Object.keys(fieldsToUpdate).join(", ")}`,
            Modificacion: modificaciones,
            Fecha: new Date()
          }
        }
      },
      { upsert: true }
    );

    const updatedOperator = await operatorService.updateOperator(RFC, fieldsToUpdate);
    res.status(200).json({ 
      message: "Operador actualizado exitosamente", 
      operator: updatedOperator 
    });
  } catch (error) {
    console.error('Error de actualización:', error);
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return handleHttpError(res, "Error de validación", 400, errorMessages);
    }
    handleHttpError(res, "Error al actualizar el operador", 500, error);
  }
};