const crypto = require('crypto');

/**
 * Genera un código aleatorio con la longitud exacta especificada
 * @param {number} longitud - Longitud exacta de la contraseña generada
 * @returns {string} - Código generado
 */
const generateCode = (longitud) => {
    const bytesNecesarios = Math.ceil(longitud / 2); // Hex duplica el tamaño, por eso se divide en 2 para que sea exacto
    return crypto.randomBytes(bytesNecesarios).toString('hex').slice(0, longitud);
};

module.exports = generateCode;
