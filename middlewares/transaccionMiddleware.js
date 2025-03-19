const { param, body, validationResult } = require("express-validator"); 
const Transaccion = require("../models/transaccion");
const Ordenante = require("../models/ordenante");
const handleHttpError = require("../utils/handleHttpError");

const validateUpdateEstadoTransaccion = [
    param("IdComprobante")
      .exists().withMessage("El IdComprobante es obligatorio")
      .notEmpty().withMessage("El IdComprobante no puede estar vacío"),
  
    body("accion")
      .exists().withMessage("La acción es obligatoria")
      .notEmpty().withMessage("La acción no puede estar vacía")
      .isIn(["Aceptar", "Rechazar"]).withMessage("Acción no válida. Debe ser 'Aceptar' o 'Rechazar'."),
  
    // Validamos la existencia de la transacción
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleHttpError(res, "Error de validación", 400, errors.array());
      }
  
      try {
        const { IdComprobante } = req.params;
        const transaccion = await Transaccion.findOne({ IdComprobante });
  
        if (!transaccion) {
          return res.status(404).json({ message: "Transacción no encontrada." });
        }
  
        req.transaccion = transaccion; // Pasamos la transacción al controlador
        next();
      } catch (error) {
        return handleHttpError(res, "Error al validar la transacción", 500, error);
      }
    },
  
    // Validar el saldo del ordenante
    async (req, res, next) => {
      const { accion } = req.body;
      const transaccion = req.transaccion;
  
      if (accion === "Aceptar") {
        try {
          const ordenante = await Ordenante.findOne({ NumeroCuenta: transaccion.NumeroCuentaOrdenante });
  
          if (!ordenante) {
            return res.status(400).json({ message: "Ordenante no encontrado." });
          }
  
          // Validamos saldo suficiente
          if (ordenante.Saldo < transaccion.Monto) {
            return res.status(400).json({ message: "Saldo insuficiente." });
          }
  
          req.ordenante = ordenante; // Pasamos el ordenante al controlador
          next();
        } catch (error) {
          return handleHttpError(res, "Error al validar el saldo del ordenante", 500, error);
        }
      } else {
        next();
      }
    }
  ];
  
  module.exports = { validateUpdateEstadoTransaccion };