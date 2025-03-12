const transaccionService = require("../services/transaccionRequestService");
const {generarIdComprobante, generarClaveRastreo} = require("../utils/generadores");
const {ocultarMonto, transformarTransaccion} = require("../utils/ocultarMonto");
const TransaccionModel = require('../models/transaccionRequest');

// Solicitar una transacción
exports.solicitarTransaccion = async (req, res) => {
  try {
    const { numeroCuentaOrdenante, numeroCuentaBeneficiario, concepto } = req.body;
    const rfcOperador = req.user.RFC;
    const montoNum = req.montoValidado;
    const { ordenante, beneficiario } = req.cuentas;
    // Obtener datos del operador
    const operador = await transaccionService.findOperador(rfcOperador);
    const montoTotal = montoNum % 1 === 0 ? montoNum + 0.01 : montoNum;
    // Preparar el documento de transacción
    const transaccionData = {
      IdComprobante: generarIdComprobante(),
      ClaveRastreo: generarClaveRastreo(),
      NumeroCuentaOrdenante: numeroCuentaOrdenante,
      NombreCompletoOrdenante: `${ordenante.NombreOrdenante} ${ordenante.ApPaterno} ${ordenante.ApMaterno || ""}`.trim(),
      NumeroCuentaBeneficiario: numeroCuentaBeneficiario,
      NombreCompletoBeneficiario: `${beneficiario.NombreOrdenante} ${beneficiario.ApPaterno} ${beneficiario.ApMaterno || ""}`.trim(),
      RFCOperador: rfcOperador,
      NombreCompletoOperador: `${operador.NombrePersonal} ${operador.ApPaterno} ${operador.ApMaterno || ""}`.trim(),
      Monto: montoTotal,
      Tipo: "Transferencia",
      Estado: "Pendiente",
      Fecha: new Date(),
      Concepto: concepto,
    };

    try {
      const nuevaTransaccion = await transaccionService.createTransaccion(transaccionData);

      // Registrar actividad
      const nombreOperadorCompleto = `${operador.NombrePersonal} ${operador.ApPaterno} ${operador.ApMaterno || ""}`.trim();
      
      // Ocultar monto en los detalles de la actividad si es necesario
      const montoMostrado = ocultarMonto(montoNum);
      const detalleActividad = `Solicitud de transacción ${nuevaTransaccion.IdComprobante} de ${numeroCuentaOrdenante} a ${numeroCuentaBeneficiario} por ${montoMostrado}`;
      
      await transaccionService.registrarActividad(
        rfcOperador,
        nombreOperadorCompleto,
        operador.Rol,
        "Registro",
        detalleActividad
      );

      // Notificar a otros operadores
      const otrosOperadores = await transaccionService.getOtrosOperadores(rfcOperador);
      transaccionService.notificarOperadores(otrosOperadores, nuevaTransaccion);

      // Transformar la transacción para ocultar el monto si es necesario
      const transaccionResponse = transformarTransaccion(
        nuevaTransaccion.toObject ? nuevaTransaccion.toObject() : nuevaTransaccion
      );

      res.status(201).json({
        success: true,
        message: "Solicitud de transacción creada correctamente",
        solicitud: transaccionResponse,
      });
    } catch (error) {
      if (error.message.includes("Error de validación")) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error al solicitar transacción:", error);
    res.status(500).json({
      success: false,
      error: "Error al procesar la solicitud: " + error.message,
    });
  }
};

// Obtener todas las transacciones
exports.obtenerTransacciones = async (req, res) => {
  try {
    // Obtener todas las transacciones sin filtros
    const transacciones = await transaccionService.getAllTransacciones();
    
    // Transformar las transacciones para ocultar montos confidenciales
    const transaccionesTransformadas = transacciones.map(t => 
      transformarTransaccion(t.toObject ? t.toObject() : t)
    );
    
    res.status(200).json({
      success: true,
      transacciones: transaccionesTransformadas
    });
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener transacciones: " + error.message
    });
  }
};

// Obtener transacciones por estado
exports.obtenerTransaccionesPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    
    // Obtener transacciones con el estado especificado
    const transacciones = await transaccionService.getTransaccionesPorEstado(estado);
    
    // Transformar las transacciones para ocultar montos confidenciales
    const transaccionesTransformadas = transacciones.map(t => 
      transformarTransaccion(t.toObject ? t.toObject() : t)
    );
    
    res.status(200).json({
      success: true,
      estado,
      transacciones: transaccionesTransformadas
    });
  } catch (error) {
    console.error("Error al obtener transacciones por estado:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener transacciones por estado: " + error.message
    });
  }
};
  
// Obtener una transacción por su ID
exports.obtenerTransaccionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaccion = await TransaccionModel.findById(id);
    
    if (!transaccion) {
      return res.status(404).json({
        success: false,
        error: "Transacción no encontrada"
      });
    }
    
    // Transformar la transacción para ocultar monto confidencial
    const transaccionTransformada = transformarTransaccion(
      transaccion.toObject ? transaccion.toObject() : transaccion
    );
    
    res.status(200).json({
      success: true,
      transaccion: transaccionTransformada
    });
  } catch (error) {
    console.error("Error al obtener transacción:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener transacción: " + error.message
    });
  }
};