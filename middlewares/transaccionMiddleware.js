// middlewares/transaccionMiddleware.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Middleware para verificar token en transacciones
exports.verificarTokenTransaccion = async (req, res, next) => {
  try {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'No se proporcionó un token válido' 
      });
    }
    
    // Extraer el token
    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'y91iFP@RHvUAfp*#MCFpWyB1997HNj^D3%71Jz%Y>Z:pnG2GQ+NtbyVmJwY*dg!K-u^P)p37QfrXmE7vxNJuMFZ2XoD0jCU},6id');
    
    // Buscar al usuario en la base de datos
    const db = mongoose.connection.db;
    const usuario = await db.collection('Personal').findOne({ 
      RFC: decoded.RFC,
      Estado: 'Activo'
    });
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuario no encontrado o inactivo' 
      });
    }
    
    // Adjuntar el usuario al objeto de solicitud
    req.user = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token inválido' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expirado' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Middleware para verificar que es un operador
exports.esOperadorTransaccion = (req, res, next) => {
  if (req.user && req.user.Rol === 'Operador') {
    return next();
  }
  return res.status(403).json({ 
    success: false, 
    error: 'Acceso denegado. Se requiere rol de operador para gestionar transacciones' 
  });
};