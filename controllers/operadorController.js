const mongoose = require('mongoose');
const TransaccionRequest = require('../models/transaccionRequest');
const emailService = require('../services/emailService');

// Obtener ordenantes asociados al operador
exports.getOrdenantes = async (req, res) => {
  try {
    const { RFC } = req.user;
    
    const ordenantes = await mongoose.connection.db.collection('Ordenante')
      .find({ RFCOperador: RFC, Estado: 'Activo' })
      .toArray();
    
    res.status(200).json({
      success: true,
      data: ordenantes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Crear solicitud de transacción
exports.solicitarTransaccion = async (req, res) => {
  try {
    const { numeroCuentaOrdenante, numeroCuentaBeneficiario, monto, concepto } = req.body;
    const db = mongoose.connection.db;
    const operador = req.user;
    
    // Validar datos
    if (!numeroCuentaOrdenante || !numeroCuentaBeneficiario || !monto || !concepto) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son obligatorios'
      });
    }
    
    // Verificar cuentas
    const ordenanteOrigen = await db.collection('Ordenante').findOne({ 
      NumeroCuenta: numeroCuentaOrdenante,
      Estado: 'Activo'
    });
    
    const ordenanteDestino = await db.collection('Ordenante').findOne({ 
      NumeroCuenta: numeroCuentaBeneficiario,
      Estado: 'Activo'
    });
    
    if (!ordenanteOrigen) {
      return res.status(404).json({
        success: false,
        error: 'Cuenta de origen no encontrada o inactiva'
      });
    }
    
    if (!ordenanteDestino) {
      return res.status(404).json({
        success: false,
        error: 'Cuenta de destino no encontrada o inactiva'
      });
    }
    
    // Verificar que el ordenante origen esté asociado al operador
    if (ordenanteOrigen.RFCOperador !== operador.RFC) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para usar esta cuenta'
      });
    }
    
    // Crear solicitud
    const nombreOrdenante = `${ordenanteOrigen.NombreOrdenante} ${ordenanteOrigen.ApPaterno} ${ordenanteOrigen.ApMaterno || ''}`.trim();
    const nombreBeneficiario = `${ordenanteDestino.NombreOrdenante} ${ordenanteDestino.ApPaterno} ${ordenanteDestino.ApMaterno || ''}`.trim();
    const nombreOperador = `${operador.NombrePersonal} ${operador.ApPaterno} ${operador.ApMaterno || ''}`.trim();
    
    const nuevaSolicitud = new TransaccionRequest({
      NumeroCuentaOrdenante: numeroCuentaOrdenante,
      NombreCompletoOrdenante: nombreOrdenante,
      RFCOrdenante: ordenanteOrigen.RFCOrdenante,
      
      NumeroCuentaBeneficiario: numeroCuentaBeneficiario,
      NombreCompletoBeneficiario: nombreBeneficiario,
      RFCBeneficiario: ordenanteDestino.RFCOrdenante,
      
      Monto: parseFloat(monto),
      Concepto: concepto,
      
      RFCOperadorSolicitante: operador.RFC,
      NombreCompletoOperadorSolicitante: nombreOperador,
      
      Estado: 'Pendiente',
      FechaSolicitud: new Date()
    });
    
    await nuevaSolicitud.save();
    
    // Registrar actividad
    await db.collection('Actividad').updateOne(
      { RFC: operador.RFC },
      {
        $set: {
          NombreCompleto: nombreOperador,
          Rol: 'Operador'
        },
        $push: {
          Actividad: {
            Accion: 'Registro',
            Detalles: `Solicitó transferencia por ${monto} de ${numeroCuentaOrdenante} a ${numeroCuentaBeneficiario}`,
            Fecha: new Date()
          }
        }
      },
      { upsert: true }
    );
    
    // Notificar a otros operadores
    const operadores = await db.collection('Personal').find({ 
      Rol: 'Operador', 
      RFC: { $ne: operador.RFC },
      Estado: 'Activo'
    }).toArray();
    
    for (const otroOperador of operadores) {
      if (otroOperador.CorreoElectronico) {
        await emailService.sendEmail({
          to: otroOperador.CorreoElectronico,
          subject: 'Nueva solicitud de transacción pendiente',
          text: `Se ha recibido una nueva solicitud de transacción por ${monto} MXN. Por favor, revisa y aprueba o rechaza la solicitud.`,
          html: `<h1>Nueva Solicitud de Transacción</h1>
                 <p>El operador ${nombreOperador} ha enviado una solicitud de transacción que requiere tu aprobación.</p>
                 <p><strong>Monto:</strong> ${monto} MXN</p>
                 <p><strong>Cuenta Origen:</strong> ${numeroCuentaOrdenante}</p>
                 <p><strong>Ordenante:</strong> ${nombreOrdenante}</p>
                 <p><strong>Cuenta Destino:</strong> ${numeroCuentaBeneficiario}</p>
                 <p><strong>Beneficiario:</strong> ${nombreBeneficiario}</p>
                 <p><strong>Concepto:</strong> ${concepto}</p>
                 <p>Por favor, ingresa al sistema para aprobar o rechazar esta solicitud.</p>`
        });
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Solicitud de transacción creada correctamente',
      data: nuevaSolicitud
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Obtener mis solicitudes
exports.getMisSolicitudes = async (req, res) => {
  try {
    const { RFC } = req.user;
    const solicitudes = await TransaccionRequest.find({ RFCOperadorSolicitante: RFC });
    
    res.status(200).json({
      success: true,
      data: solicitudes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};