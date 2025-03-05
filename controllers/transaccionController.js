const transaccionService = require('../services/transaccionService');
const { generarIdComprobante, generarClaveRastreo } = require('../utils/generadores');

// Solicitar una transacción
exports.solicitarTransaccion = async (req, res) => {
  try {
    const { numeroCuentaOrdenante, numeroCuentaBeneficiario, monto, concepto } = req.body;
    const rfcOperador = req.user.RFC;
    
    // Validaciones
    if (!numeroCuentaOrdenante || !numeroCuentaBeneficiario || !monto || !concepto) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son obligatorios'
      });
    }
    
    if (numeroCuentaOrdenante === numeroCuentaBeneficiario) {
      return res.status(400).json({
        success: false,
        error: 'No puedes realizar una transacción a la misma cuenta'
      });
    }
    
    // Validar monto
    const montoNum = Number(parseFloat(monto).toFixed(2));
    if (isNaN(montoNum) || montoNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'El monto debe ser un número positivo'
      });
    }
    
    // Obtener ordenante y validar permisos
    const ordenante = await transaccionService.findOrdenante(numeroCuentaOrdenante);
    if (!ordenante) {
      return res.status(404).json({
        success: false,
        error: 'Ordenante no encontrado o inactivo'
      });
    }
    
    if (ordenante.RFCOperador !== rfcOperador) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para usar esta cuenta de ordenante'
      });
    }
    
    // Obtener beneficiario
    const beneficiario = await transaccionService.findOrdenante(numeroCuentaBeneficiario);
    if (!beneficiario) {
      return res.status(404).json({
        success: false,
        error: 'Beneficiario no encontrado o inactivo'
      });
    }
    
    // Obtener datos del operador
    const operador = await transaccionService.findOperador(rfcOperador);
    
    // Preparar el documento de transacción
    const transaccionData = {
      IdComprobante: generarIdComprobante(),
      ClaveRastreo: generarClaveRastreo(),
      NumeroCuentaOrdenante: numeroCuentaOrdenante,
      NombreCompletoOrdenante: `${ordenante.NombreOrdenante} ${ordenante.ApPaterno} ${ordenante.ApMaterno || ''}`.trim(),
      NumeroCuentaBeneficiario: numeroCuentaBeneficiario,
      NombreCompletoBeneficiario: `${beneficiario.NombreOrdenante} ${beneficiario.ApPaterno} ${beneficiario.ApMaterno || ''}`.trim(),
      RFCOperador: rfcOperador,
      NombreCompletoOperador: `${operador.NombrePersonal} ${operador.ApPaterno} ${operador.ApMaterno || ''}`.trim(),
      Monto: montoNum,
      Tipo: 'Transferencia',
      Estado: 'Pendiente',
      Fecha: new Date(),
      Concepto: concepto
    };
    
    try {
      const nuevaTransaccion = await transaccionService.createTransaccion(transaccionData);
      
      // Registrar actividad
      const nombreOperadorCompleto = `${operador.NombrePersonal} ${operador.ApPaterno} ${operador.ApMaterno || ''}`.trim();
      await transaccionService.registrarActividad(
        rfcOperador,
        nombreOperadorCompleto,
        operador.Rol,
        'Registro',
        `Solicitud de transacción ${nuevaTransaccion.IdComprobante} de ${numeroCuentaOrdenante} a ${numeroCuentaBeneficiario} por ${montoNum}`
      );
      
      // Notificar a otros operadores
      const otrosOperadores = await transaccionService.getOtrosOperadores(rfcOperador);
      transaccionService.notificarOperadores(otrosOperadores, nuevaTransaccion);
      
      res.status(201).json({
        success: true,
        message: 'Solicitud de transacción creada correctamente',
        solicitud: nuevaTransaccion
      });
    } catch (error) {
      if (error.message.includes('Error de validación')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error al solicitar transacción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud: ' + error.message
    });
  }
};