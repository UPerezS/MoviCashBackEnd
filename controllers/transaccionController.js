const Transaccion = require("../models/transaccion");
const Ordenante = require("../models/ordenante");
const Notificacion = require("../services/notificacionService");

const handleHttpError = require("../utils/handleHttpError")


// Actualizar el estado de una transacción- Rechazar o aceptar transacción 
exports.updateEstadoTransaccion = async (req, res) => {
    const { IdComprobante } = req.params; // ID de la transacción como parámetro
    const { accion } = req.body; // Acción a realizar ("aceptada" o "rechazada")

    try {
        const transaccion = await Transaccion.findOne({IdComprobante});
        
        if (!transaccion) {
            return res.status(404).json({ message: "Transacción no encontrada." });
        }

        if (!["Aceptar", "Rechazar"].includes(accion)) {
            return res.status(400).json({ message: "Acción no válida. Debe ser 'Aceptar' o 'Rechazar'." });
        }

        transaccion.Estado = accion === "Aceptar" ? "Aprobado" : "Cancelado";
        transaccion.FechaActualizacionRespuesta = new Date();

        if (accion === "Aceptar") {
            
            const ordenante = await Ordenante.findOne({ NumeroCuenta: transaccion.NumeroCuentaOrdenante });
            const beneficiario = await Ordenante.findOne({ NumeroCuenta: transaccion.NumeroCuentaBeneficiario});

            if (!ordenante || !beneficiario) {
                return res.status(400).json({ message: "Ordenante o beneficiario no encontrado." });
            }

            // Validar saldo del ordenante que ya deberia de estar valido anteriormente 
            if (ordenante.Saldo < transaccion.Monto) {
                return res.status(400).json({ message: "Saldo insuficiente." });
            }

            // Realizar la transacción
            ordenante.Saldo -= transaccion.Monto;
            beneficiario.Saldo += transaccion.Monto;

            await ordenante.save();
            await beneficiario.save();
        }

        await transaccion.save();

  // Guardar notificación pendiente para el operador
  const mensaje = `La transacción ${transaccion.IdComprobante} se ha  ${transaccion.Estado}.`;

  // Guardar la notificación en MongoDB (en caso de que el operador no esté conectado)
 Notificacion.guardarNotificacion(transaccion.RFCOperador, mensaje, transaccion.IdComprobante);

  res.status(200).json({ message: `Transacción ${accion} con éxito.`, data: transaccion });
} catch (error) {
  console.error("Error al actualizar la transacción: ", error);
  res.status(500).json({ message: "Error interno del servidor." });
}

};

exports.depositoCuentaAhorro = async (req, res) => { 
    try {
        const { RFCOrdenante, NumeroCuenta, monto } = req.body;

        if (!RFCOrdenante || !NumeroCuenta || !monto) {
            return handleHttpError(res, "Todos los campos son obligatorios.", 400);
        }

        if (monto <= 0) {
            return handleHttpError(res, "El monto debe ser mayor a 0.", 400);
        }

        // Buscar el ordenante por su RFC y Número de Cuenta
        const ordenante = await Ordenante.findOne({ RFCOrdenante, NumeroCuenta });

        if (!ordenante) {
            return handleHttpError(res, "Ordenante no encontrado.", 404);
        }

        // Sumar el monto al saldo actual
        const montoActualizado = ordenante.Saldo + monto;

        // Actualizar el saldo y la fecha de última modificación correctamente
        const updatedOrdenante = await Ordenante.findOneAndUpdate(
            { RFCOrdenante, NumeroCuenta },
            { 
                $set: { 
                    Saldo: montoActualizado, 
                    FechaUltimaModificacion: new Date() 
                }
            },
            { new: true, runValidators: true, context: 'query' }
        );

        res.status(200).json({ 
            message: "Depósito realizado con éxito.", 
            updatedOrdenante
        });

    } catch (error) {
        console.error("Error al realizar el depósito:", error);
        return handleHttpError(res, "Error interno del servidor.", 500, error);
    }
};
