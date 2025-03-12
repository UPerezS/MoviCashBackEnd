const mongoose = require('mongoose');
const TransaccionModel = require('../models/transaccionRequest');
const OrdenanteModel = require('../models/ordenante'); 
const PersonalModel = require('../models/personal'); 
const ActividadModel = require('../models/actividad'); 
const { ocultarMonto } = require('../utils/ocultarMonto');

// Buscar ordenante por número de cuenta
exports.findOrdenante = async (numeroCuenta) => {
  return await OrdenanteModel.findOne({
    NumeroCuenta: numeroCuenta,
    Estado: 'Activo'
  });
};

// Buscar operador por RFC
exports.findOperador = async (rfc) => {
  return await PersonalModel.findOne({ RFC: rfc });
};

// Buscar transacción por ID
exports.findById = async (id) => {
  return await TransaccionModel.findById(id);
};

// Crear una transacción
exports.createTransaccion = async (transaccionData) => {
  try {
    const nuevaTransaccion = new TransaccionModel({
      ...transaccionData,
      // Asegurar que Monto sea double
      Monto: Number(transaccionData.Monto)
    });
    
    return await nuevaTransaccion.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Error de validación del documento:', error.message);
      throw new Error('Error de validación del documento. Por favor, verifica los campos.');
    }
    throw error;
  }
};

// Registrar actividad
exports.registrarActividad = async (rfcOperador, nombreCompleto, rol, accion, detalles) => {
  try {
    // Buscar si ya existe un documento para este RFC
    let actividad = await ActividadModel.findOne({ RFC: rfcOperador });
    
    if (!actividad) {
      // Si no existe, crear uno nuevo
      actividad = new ActividadModel({
        RFC: rfcOperador,
        NombreCompleto: nombreCompleto,
        Rol: rol,
        Acciones: []
      });
    } else {
      // Actualizar nombre y rol por si han cambiado
      actividad.NombreCompleto = nombreCompleto;
      actividad.Rol = rol;
    }
    // Añadir la nueva acción
    actividad.Acciones.push({
      Accion: accion,
      Detalles: detalles,
      Fecha: new Date()
    });
    
    // Guardar el documento
    await actividad.save();
    
  } catch (error) {
    console.error('Error al registrar actividad:', error);
    throw error;
  }
};

// Obtener otros operadores para notificar
exports.getOtrosOperadores = async (rfcOperador) => {
  return await PersonalModel.find({
    RFC: { $ne: rfcOperador },
    Estado: 'Activo',
    Rol: 'Operador'
  });
};

// Obtener todas las transacciones
exports.getAllTransacciones = async () => {
  return await TransaccionModel.find().sort({ Fecha: -1 });
};

// Obtener transacciones por estado
exports.getTransaccionesPorEstado = async (estado) => {
  return await TransaccionModel.find({ Estado: estado }).sort({ Fecha: -1 });
};

// Notificar a operadores
exports.notificarOperadores = async (operadores, transaccion) => {
  // Importar el servicio de notificaciones
  const notificacionService = require('../services/notificacionService');
  
  if (operadores && operadores.length > 0) {
    // Determinar si el monto debe ser ocultado (> 20,000)
    const montoMostrado = transaccion.Monto > 20000 ? "MONTO CONFIDENCIAL" : transaccion.Monto;
    
    // Crear notificaciones para cada operador
    for (const operador of operadores) {
      const mensaje = `Nueva solicitud de transacción ${transaccion.IdComprobante} de ${transaccion.NombreCompletoOrdenante} a ${transaccion.NombreCompletoBeneficiario} por ${montoMostrado}.`;
      
      // función de notificación existente, especificando el tipo como 'SolicitudTransaccion'
      await notificacionService.guardarNotificacion(operador.RFC, mensaje,transaccion._id,'SolicitudTransaccion');
    }
    console.log(`Se enviaron notificaciones a ${operadores.length} operadores sobre la transacción ${transaccion.IdComprobante}`);
  }
};