const { body, validationResult } = require("express-validator");

exports.validateRegister = [
  body("RFC")
    .exists()
    .isLength({min:5})
    .notEmpty(),
  body("NombrePersonal")
    .exists()
    .withMessage("El nombre es obligatorio")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 6, max: 20 })
    .withMessage("El nombre debe tener entre 6 y 20 caracteres"),
  body("CorreoElectronico")
    .exists()
    .withMessage("El correo electrónico es obligatorio")
    .notEmpty()
    .withMessage("El correo electrónico no puede estar vacío")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware para validar el login
exports.validateLogin = [
  body("CorreoElectronico")
    .exists()
    .withMessage("El correo electrónico es obligatorio")
    .notEmpty()
    .withMessage("El correo electrónico no puede estar vacío")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  body("Password")
    .exists()
    .withMessage("La contraseña es obligatoria")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 6, max: 20 })
    .withMessage("La contraseña debe tener entre 6 y 20 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
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
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];