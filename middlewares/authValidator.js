const { body, validationResult } = require("express-validator");
const handleHttpError = require('../utils/handleHttpError');

exports.validateRegister = [
  body("RFC").exists().isLength({ min: 5 }).notEmpty().withMessage("RFC no válido"),
  body("NombrePersonal").exists().notEmpty().isLength({ min: 2, max: 20 }).withMessage("Nombre no válido"),
  body("CorreoElectronico").exists().notEmpty().isEmail().withMessage("Correo electrónico no válido"),
  body("ApPaterno").exists().notEmpty().withMessage("ApPaterno no válido"),
  body("ApMaterno").optional(),
  body("Sexo").exists().notEmpty().withMessage("Sexo no válido"),
  body("FechaNacimiento").exists().notEmpty().withMessage("Fecha de nacimiento no válida"),
  body("Rol").exists().notEmpty().withMessage("Rol no válido"),
  body("Direccion.NumeroExterior").exists().notEmpty().withMessage("Dirección.NumeroExterior no válido"),
  body("Direccion.NumeroInterior").optional(),
  body("Direccion.Calle").exists().notEmpty().withMessage("Dirección.Calle no válida"),
  body("Direccion.Colonia").exists().notEmpty().withMessage("Dirección.Colonia no válida"),
  body("Direccion.Ciudad").exists().notEmpty().withMessage("Dirección.Ciudad no válida"),
  body("Telefono.*.Lada").exists().notEmpty().withMessage("Lada del Teléfono no válido"),
  body("Telefono.*.Numero").exists().notEmpty().withMessage("Número de Teléfono no válido"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleHttpError(res, "Error de validación", 400, errors.array());
    }
    next();
  }
];


// Middleware para validar el login
exports.validateLogin = [
  body("CorreoElectronico").exists().notEmpty().isEmail().withMessage("El correo electrónico no es válido"),
  body("Password").exists().notEmpty().isLength({ min: 5, max: 20 }).withMessage("La contraseña debe tener entre 6 y 20 caracteres"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleHttpError(res, "Error de validación", 400, errors.array());
    }
    next();
  }
];

exports.validateCodigo = [
  body("CorreoElectronico").exists().trim().notEmpty().withMessage("El correo electronico no es válido"),
  body("code").exists().notEmpty().trim().withMessage("El codigo es necesario"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleHttpError(res, "Error de validación", 400, errors.array());
    }
    next();
  }
];

// Middleware para validar el cambio de contraseña
exports.validateNewPassword = [
  body("CorreoElectronico")
    .exists()
    .withMessage("El correo electrónico es obligatorio")
    .notEmpty()
    .withMessage("El correo electrónico no puede estar vacío")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),

  body("tempPassword")
    .exists()
    .withMessage("La contraseña actual es obligatoria")
    .notEmpty()
    .withMessage("La contraseña actual no puede estar vacía"),

  body("newPassword")
    .exists()
    .withMessage("La nueva contraseña es obligatoria")
    .notEmpty()
    .withMessage("La nueva contraseña no puede estar vacía")
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