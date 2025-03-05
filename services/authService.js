const VerificationCode = require('../models/VerificarCodigo');
const generarCodigo = require('../utils/handleCode');
const { tokenSign } = require('../utils/handleJwt');

/**
 * Genera un código de verificación y lo guarda en la DB
 * @param {String} userId 
 * @returns {String} Código generado
 */
const generarCodigoVerificacion = async (userId) => {
  const code = generarCodigo(6);
  await VerificationCode.create({ userId, code });
  return code;
};

/**
 * Verifica si el código es válido para el usuario
 * @param {String} userId 
 * @param {String} code 
 * @returns {Boolean}
 */
const verificarCodigo = async (userId, code) => {
  const record = await VerificationCode.findOne({ userId, code });
  if (record) {
    await VerificationCode.deleteOne({ _id: record._id }); // Elimina el código usado
    return true;
  }
  return false;
};

/**
 * Genera un token JWT para el usuario
 * @param {Object} user 
 * @returns {String} Token firmado
 */
const generarToken = async (user) => {
  return await tokenSign(user);
};

module.exports = { generarCodigoVerificacion, verificarCodigo, generarToken };