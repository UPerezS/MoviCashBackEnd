const { body, validationResult } = require('express-validator');
const handleHttpError = require('../utils/handleHttpError');

// Validaciones para el registro de ordenante
exports.validateRegisterOrdenante = [
    // Validación del campo RFC del ordenante
    body("RFCOrdenante")
        .exists()
        .withMessage("El RFC es requerido")
        .notEmpty()
        .withMessage("El RFC no puede estar vacío")
        .isLength({ min: 13, max: 13 })
        .withMessage("El RFC debe tener 13 caracteres")
        .matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/)
        .withMessage("El RFC debe ser válido"),
    // Validación del campo Nombre del ordenante
    body("NombreOrdenante")
        .exists()
        .withMessage("El nombre del ordenante es requerido")
        .notEmpty()
        .withMessage("El campo nombre no puede estar vacío")
        .isLength({ max: 30 })
        .withMessage("El nombre no puede tener más de 30 caracteres"),

    // Validaciones de los apellidos del ordenante
    body("ApMaterno")
        .optional()
        .isLength({ max: 20 })
        .withMessage("El apellido materno no puede tener más de 20 caracteres"),
    body("ApPaterno")
        .exists()
        .withMessage("El apellido paterno es requerido")
        .notEmpty()
        .withMessage("El campo apellido paterno no puede estar vacío")
        .isLength({ max: 20 })
        .withMessage("El apellido paterno no puede tener más de 20 caracteres"),

    // Validación para el campo de Sexo
    body("Sexo")
        .exists()
        .withMessage("El sexo es requerido")
        .notEmpty()
        .withMessage("El campo sexo no puede estar vacío")
        .isIn(["M", "F"])
        .withMessage("Seleccione 'M' para Masculino, 'F' para Femenino"),

    // Validación para la Fecha de nacimiento
    body("FechaNacimiento")
        .exists()
        .withMessage("La fecha de nacimiento es requerida")
        .notEmpty()
        .withMessage("La fecha de nacimiento no puede estar vacía")
        .isISO8601()
        .withMessage("La fecha de nacimiento debe estar en formato ISO"),

    // Validación para el número de cuenta del ordenante
    body("NumeroCuenta")
        .exists()
        .withMessage("El número de cuenta es obligatorio")
        .notEmpty()
        .withMessage("El número de cuenta no puede estar vacío"),

    // Validación para el saldo de la cuenta del ordenante
    body("Saldo")
        .exists()
        .withMessage("El saldo de la cuenta es requerido")
        .notEmpty()
        .withMessage("El saldo de la cuenta no puede estar vacío")
        .isFloat({ min: 0 })
        .withMessage("El saldo de la cuenta debe ser mayor o igual a 0"),

    // Validación para el teléfono del ordenante
    body("Telefono")
        .exists()
        .withMessage("El teléfono es requerido")
        .notEmpty()
        .withMessage("El campo teléfono no puede estar vacío")
        .isArray()
        .withMessage("Debe proporcionar al menos un número telefónico"),

    // Validación para la dirección del ordenante (Número exterior)
    body("Direccion.NumeroExterior")
        .exists()
        .withMessage("Ingrese el número exterior")
        .notEmpty()
        .withMessage("El número exterior no puede estar vacío")
        .isString()
        .withMessage("El número exterior debe ser texto"),

    // Número interior
    body("Direccion.NumeroInterior")
        .optional()
        .isString()
        .withMessage("El número interior debe ser texto"),

    // Calle
    body("Direccion.Calle")
        .exists()
        .withMessage("Ingrese el nombre de la calle")
        .notEmpty()
        .withMessage("El nombre de la calle no puede estar vacío")
        .isString()
        .withMessage("El nombre de la calle debe ser texto"),

    // Colonia
    body("Direccion.Colonia")
        .exists()
        .withMessage("Ingrese el nombre de la colonia")
        .notEmpty()
        .withMessage("El nombre de la colonia no puede estar vacío")
        .isString()
        .withMessage("El nombre de la colonia debe ser texto"),

    // Ciudad
    body("Direccion.Ciudad")
        .exists()
        .withMessage("Ingrese el nombre de la ciudad")
        .notEmpty()
        .withMessage("El nombre de la ciudad no puede estar vacío")
        .isString()
        .withMessage("El nombre de la ciudad debe ser texto"),

    // Validación para la fecha de registro
    body("FechaRegistro")
        .exists()
        .withMessage("La fecha de registro es requerida")
        .notEmpty()
        .withMessage("La fecha de registro no puede estar vacía")
        .isISO8601()
        .withMessage("La fecha de registro debe estar en formato ISO"),

    // Función para verificación de errores
    (req, res, next) => {
        const errors = validationResult(req); // Recopila los errores
        if (!errors.isEmpty()) {
            return handleHttpError(res, "Error de Validacion", 400, errors.array());
        }
        next(); // Continúa con el siguiente middleware o controlador si no hay errores
    },
];

