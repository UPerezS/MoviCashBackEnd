const mongoose = require('mongoose');
const TransaccionModel = require('../models/transaccion');
const { generarIdComprobante, generarClaveRastreo } = require('../utils/generadores');

// Obtener ordenantes de un operador
exports.getOrdenantesByOperador = async (rfcOperador) => {
  const db = mongoose.connection.db;
  return await db.collection('Ordenante').find({
    RFCOperador: rfcOperador,
    Estado: 'Activo'
  }).toArray();
};

// Buscar ordenante por número de cuenta
exports.findOrdenante = async (numeroCuenta) => {
  const db = mongoose.connection.db;
  return await db.collection('Ordenante').findOne({
    NumeroCuenta: numeroCuenta,
    Estado: 'Activo'
  });
};

// Buscar operador por RFC
exports.findOperador = async (rfc) => {
  const db = mongoose.connection.db;
  return await db.collection('Personal').findOne({ RFC: rfc });
};

// Crear una transacción usando el método save() de Mongoose
exports.createTransaccion = async (transaccionData) => {
  try {
    const nuevaTransaccion = new TransaccionModel({
      ...transaccionData,
      // Asegurar que Monto sea double
      Monto: Number(transaccionData.Monto)
    });
    
    // Guardar usando el método save()
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
  const db = mongoose.connection.db;
  await db.collection('Actividad').updateOne(
    { RFC: rfcOperador },
    {
      $set: {
        NombreCompleto: nombreCompleto,
        Rol: rol
      },
      $push: {
        Acciones: {
          Accion: accion,
          Detalles: detalles,
          Fecha: new Date()
        }
      }
    },
    { upsert: true }
  );
};

// Obtener otros operadores para notificar
exports.getOtrosOperadores = async (rfcOperador) => {
  const db = mongoose.connection.db;
  return await db.collection('Personal').find({
    RFC: { $ne: rfcOperador },
    Estado: 'Activo',
    Rol: 'Operador'
  }).toArray();
};

// Notificar a operadores (simulacion)
exports.notificarOperadores = (operadores, transaccion) => {
  if (operadores && operadores.length > 0) {
    console.log(`========== NOTIFICACIÓN A ${operadores.length} OPERADORES ==========`);

    for (const operador of operadores) {
      console.log(`Para: ${operador.NombrePersonal} ${operador.ApPaterno} (${operador.CorreoElectronico})`);
      console.log('Nueva solicitud de transacción pendiente de aprobación');
      console.log(`ID: ${transaccion._id}`);
      console.log(`Comprobante: ${transaccion.IdComprobante}`);
      console.log(`Solicitante: ${transaccion.NombreCompletoOperador}`);
      console.log(`De: ${transaccion.NombreCompletoOrdenante} (${transaccion.NumeroCuentaOrdenante})`);
      console.log(`Para: ${transaccion.NombreCompletoBeneficiario} (${transaccion.NumeroCuentaBeneficiario})`);
      console.log(`Monto: ${transaccion.Monto}`);
      console.log(`Concepto: ${transaccion.Concepto}`);
    }

    console.log('==============================================');
  } else {
    console.log('No se encontraron otros operadores para notificar');
  }
};