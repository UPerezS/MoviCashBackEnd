const { body, validationResult } = require("express-validator");
const handleHttpError = require('../utils/handleHttpError');

exports.validateUpdateOperator = [
  body("RFC").optional().isLength({ min: 5 }).withMessage("RFC no válido"),
  body("NombrePersonal").optional().isLength({ min: 2, max: 20 }).withMessage("Nombre no válido"),
  body("CorreoElectronico").optional().isEmail().withMessage("Correo electrónico no válido"),
  body("ApPaterno").optional().notEmpty().withMessage("ApPaterno no válido"),
  body("ApMaterno").optional(),
  body("Sexo").optional().notEmpty().withMessage("Sexo no válido"),
  body("FechaNacimiento").optional().notEmpty().withMessage("Fecha de nacimiento no válida"),
  body("Rol").optional().notEmpty().withMessage("Rol no válido"),
  body("Direccion.NumeroExterior").optional().notEmpty().withMessage("Dirección.NumeroExterior no válido"),
  body("Direccion.NumeroInterior").optional(),
  body("Direccion.Calle").optional().notEmpty().withMessage("Dirección.Calle no válida"),
  body("Direccion.Colonia").optional().notEmpty().withMessage("Dirección.Colonia no válida"),
  body("Direccion.Ciudad").optional().notEmpty().withMessage("Dirección.Ciudad no válida"),
  body("Telefono.*.Lada").optional().notEmpty().withMessage("Lada del Teléfono no válido"),
  body("Telefono.*.Numero").optional().notEmpty().withMessage("Número de Teléfono no válido"),

  body("Password")
    .optional()
    .isLength({ min: 8, max: 30 })
    .withMessage("La contraseña debe tener entre 8 y 30 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una letra minúscula")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[\W_]/)
    .withMessage("La contraseña debe contener al menos un carácter especial (@, #, $, etc.)"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleHttpError(res, "Error de validación", 400, errors.array());
    }
    next();
  }
];
