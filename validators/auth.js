const { check } = require("express-validator");

const validatorRegister = [

    check("NombrePersonal")
        .exist()
        .notEmpty()
        .isLength({ min: 6, max: 20 }),
    check("CorreoElectronico")
        .exist()
        .notEmpty()
        .isLength({ min: 3, max: 99 }),
    check("Password")
        .exist()
        .notEmpty()
        .isLength({ min: 6, max: 20 }),

]

const validatorLogin = [

    check("CorreoElectronico")
        .exist()
        .notEmpty()
        .isLength({ min: 3, max: 99 }),
    check("Password")
        .exist()
        .notEmpty()
        .isLength({ min: 6, max: 20 }),

]

module.exports = { validatorRegister, validatorLogin }