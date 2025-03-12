const { body, validationResult } = require('express-validator');

// Validaciones para el registro de ordenante
exports.validateRegisterOrdenante = [
    // Validación del campo RFC del ordenante
    body("RFCOrdenante")
        .exists()
        .withMessage("El RFC es requerido")
        .isLength({ min: 13, max: 13 })
        .withMessage("El RFC debe tener 13 caracteres")
        .matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/)
        .withMessage("El RFC debe ser válido"),

    // Validación del campo RFC del operador
    body("RFCOperador")
        .exists()
        .withMessage("El RFC del operador es requerido")
        .isLength({ min: 13, max: 13 })
        .withMessage("El RFC debe tener 13 caracteres"),

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
        .isIn(["M", "F"])
        .withMessage("Seleccione 'M' para Masculino, 'F' para Femenino"),

    // Validación para la Fecha de nacimiento
    body("FechaNacimiento")
        .exists()
        .withMessage("La fecha de nacimiento es requerida")
        .isISO8601()
        .withMessage("La fecha de nacimiento debe estar en formato ISO"),

    // Validación para el número de cuenta del ordenante
    body("NumeroCuenta")
        .exists()
        .withMessage("El número de cuenta es obligatorio"),

    // Validación para el saldo de la cuenta del ordenante
    body("Saldo")
        .exists()
        .withMessage("El saldo de la cuenta es requerido")
        .isFloat({ min: 0 })
        .withMessage("El saldo de la cuenta debe ser mayor o igual a 0"),

    // Validación para el teléfono del ordenante
    body("Telefono")
        .exists()
        .withMessage("El teléfono es requerido")
        .isArray()
        .withMessage("Debe proporcionar al menos un número telefónico"),

    // Validación para la dirección del ordenante (Número exterior)
    body("Direccion.NumeroExterior")
        .exists()
        .withMessage("Ingrese el número exterior")
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
        .isString()
        .withMessage("El nombre de la calle debe ser texto"),

    // Colonia
    body("Direccion.Colonia")
        .exists()
        .withMessage("Ingrese el nombre de la colonia")
        .isString()
        .withMessage("El nombre de la colonia debe ser texto"),

    // Ciudad
    body("Direccion.Ciudad")
        .exists()
        .withMessage("Ingrese el nombre de la ciudad")
        .isString()
        .withMessage("El nombre de la ciudad debe ser texto"),

    // Validación para la fecha de registro
    body("FechaRegistro")
        .exists()
        .withMessage("La fecha de registro es requerida")
        .isISO8601()
        .withMessage("La fecha de registro debe estar en formato ISO"),

    // Función para verificación de errores
    (req, res, next) => {
        const errors = validationResult(req); // Recopila los errores
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Retorna los errores si hay alguno
        }
        next(); // Continúa con el siguiente middleware o controlador si no hay errores
    },
];
