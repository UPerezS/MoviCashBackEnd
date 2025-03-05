const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

/**
 * Contraseña para encriptar
 * @param {*} passwordPlane 
 */

const hash = async (passwordPlane, salt) => {
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

const generateTempPassword = () => {
    return crypto.randomBytes(6).toString("hex");
};

module.exports = {hash,compare, generateTempPassword};