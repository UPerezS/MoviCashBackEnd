const bcryptjs = require("bcryptjs");

/**
 * Contraseña para encriptar
 * @param {*} passwordPlane 
 */

const encript = async (passwordPlane, salt) => {
    const hash = await bcryptjs.hash(passwordPlane, 10)

    return hash
}

/**
 * Pasar contraseña sin encriptar y pasar contraseña encriptada
 * @param {*} passwordPlane 
 * @param {*} hashPassword 
 */

const compare = async (passwordPlane, hashPassword) => {
    return await bcryptjs.compare(passwordPlane, hashPassword)
}

module.exports = {encript,compare};