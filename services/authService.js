const VerificationCode = require('../models/verificarCodigo');
const generarCodigo = require('../utils/handleCode');
const { tokenSign } = require('../utils/handleJwt');

//Genera un código de verificación y lo guarda en la DB
const generarCodigoVerificacion = async (userId) => {
  const code = generarCodigo(6);
  await VerificationCode.create({ userId, code });
  return code;
};


// Verifica si el código es válido para el usuario
const verificarCodigo = async (userId, code) => {

  const record = await VerificationCode.findOne({ userId, code });
  if (record) {
    await VerificationCode.deleteOne({ _id: record._id }); // Elimina el código usado
    return true;
  }

  return false;
};


// Genera un token JWT para el usuario

const generarToken = async (user) => {
  return tokenSign(user);
};

module.exports = { generarCodigoVerificacion, verificarCodigo, generarToken };