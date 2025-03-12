const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const transaccionService = require('../services/transaccionRequestService');

// Verificar token en transacciones
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
    
    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const db = mongoose.connection.db;
    
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(decoded._id);
    } catch (error) {
      return res.status(400).json({ 
        success: false,
        error: 'ID de usuario inválido en el token' 
      });
    }
    
    // Buscar usuario por _id
    const usuario = await db.collection('Personal').findOne({ 
      _id: objectId,
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

// Verificar que es un operador
exports.esOperadorTransaccion = (req, res, next) => {
  if (req.user && req.user.Rol === 'Operador') {
    return next();
  }
  return res.status(403).json({ 
    success: false,
    error: 'Acceso denegado. Se requiere rol de operador para gestionar transacciones' 
  });
};

// Validación de datos de transacción
exports.validarDatosTransaccion = (req, res, next) => {
  try {
    const { numeroCuentaOrdenante, numeroCuentaBeneficiario, monto, concepto } = req.body;

    // Validaciones
    if (!numeroCuentaOrdenante || !numeroCuentaBeneficiario || !monto || !concepto) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios",
      });
    }

    if (numeroCuentaOrdenante === numeroCuentaBeneficiario) {
      return res.status(400).json({
        success: false,
        error: "No puedes realizar una transacción a la misma cuenta",
      });
    }

    // Validar monto
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      return res.status(400).json({
        success: false,
        error: "El monto debe ser un número positivo",
      });
    }

    // Guardar el monto validado para usarlo en el controlador
    req.montoValidado = montoNum;
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error al validar los datos: " + error.message
    });
  }
};

// Validar cuentas y permisos
exports.validarCuentasYPermisos = async (req, res, next) => {
  try {
    const { numeroCuentaOrdenante, numeroCuentaBeneficiario } = req.body;
    const rfcOperador = req.user.RFC;
    const montoNum = req.montoValidado;

    // Obtener ordenante y validar permisos
    const ordenante = await transaccionService.findOrdenante(numeroCuentaOrdenante);
    if (!ordenante) {
      return res.status(404).json({
        success: false,
        error: "Ordenante no encontrado o inactivo",
      });
    }

    if (ordenante.RFCOperador !== rfcOperador) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para usar esta cuenta de ordenante",
      });
    }

    // Verificar si el ordenante tiene saldo suficiente
    if (ordenante.Saldo < montoNum) {
      return res.status(400).json({
        success: false,
        error: `Saldo insuficiente.`,
      });
    }

    // Obtener beneficiario
    const beneficiario = await transaccionService.findOrdenante(numeroCuentaBeneficiario);
    if (!beneficiario) {
      return res.status(404).json({
        success: false,
        error: "Beneficiario no encontrado o inactivo",
      });
    }

    // Guardar las cuentas para usarlas en el controlador
    req.cuentas = { ordenante, beneficiario };
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error al validar cuentas: " + error.message
    });
  }
};

// Validar estado para filtro de transacciones
exports.validarEstadoTransaccion = (req, res, next) => {
  const { estado } = req.params;
  
  // Validar que el estado sea válido
  const estadosValidos = ['Pendiente', 'Aprobado', 'Cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({
      success: false,
      error: `Estado no válido. Debe ser uno de: ${estadosValidos.join(', ')}`
    });
  }
  
  next();
};