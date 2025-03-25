const { verifyToken } = require('../utils/handleJwt');

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    const token = req.headers.authorization.split(' ').pop();
    const dataToken = await verifyToken(token);

    if (!dataToken || !dataToken._id) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }

    req.user = dataToken; // Usa los datos del token directamente
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error en la autenticación', error: error.message });
  }
};

module.exports = authMiddleware;
