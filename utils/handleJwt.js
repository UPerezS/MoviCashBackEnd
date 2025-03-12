const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Firma un token JWT con los datos del usuario
 * @param {Object} user 
 * @returns {String} Token firmado
 */
const tokenSign = async (user) => {
  const sign = jwt.sign(
    {
      _id: user._id,
      role: user.Rol,
      RFC: user.RFC,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  return sign;
};

/**
 * Verifica un token JWT
 * @param {String} tokenJwt 
 * @returns {Object|null} Datos decodificados o null si falla
 */
const verifyToken = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { tokenSign, verifyToken };