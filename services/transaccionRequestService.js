const mongoose = require('mongoose');
const TransaccionModel = require('../models/transaccionRequest');
const OrdenanteModel = require('../models/ordenante'); // Usa la ruta correcta a tu modelo
const PersonalModel = require('../models/personal'); // Asegúrate de que este modelo exista
const ActividadModel = require('../models/actividad'); // Usa la ruta correcta a tu modelo
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

// Notificar a operadores (modificado para usar el modelo de notificaciones si lo tienes)
exports.notificarOperadores = async (operadores, transaccion) => {
  if (operadores && operadores.length > 0) {
    console.log(`========== NOTIFICACIÓN A ${operadores.length} OPERADORES ==========`);
    
    const montoMostrado = ocultarMonto(transaccion.Monto);
    
    // Si tienes un servicio de notificaciones, lo usarías aquí
    // const notificacionService = require('./notificacionService');
    // await notificacionService.notificarNuevaTransaccion(operadores, transaccion);
    
    for (const operador of operadores) {
      console.log(`Para: ${operador.NombrePersonal} ${operador.ApPaterno} (${operador.CorreoElectronico})`);
      console.log('Nueva solicitud de transacción pendiente de aprobación');
      console.log(`ID: ${transaccion._id}`);
      console.log(`Comprobante: ${transaccion.IdComprobante}`);
      console.log(`Solicitante: ${transaccion.NombreCompletoOperador}`);
      console.log(`De: ${transaccion.NombreCompletoOrdenante} (${transaccion.NumeroCuentaOrdenante})`);
      console.log(`Para: ${transaccion.NombreCompletoBeneficiario} (${transaccion.NumeroCuentaBeneficiario})`);
      console.log(`Monto: ${montoMostrado}`);
      console.log(`Concepto: ${transaccion.Concepto}`);
    }
    
    console.log('==============================================');
  } else {
    console.log('No se encontraron otros operadores para notificar');
  }
};