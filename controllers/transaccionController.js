const Ordenante = require("../models/ordenante");
const Notificacion = require("../services/notificacionService");
const handleHttpError = require("../utils/handleHttpError");


const handleHttpError = require("../utils/handleHttpError")


// Actualizar el estado de una transacción- Rechazar o aceptar transacción 
exports.updateEstadoTransaccion = async (req, res) => {
    try {
    const { accion } = req.body; 
    const transaccion = req.transaccion; 
    const ordenante = req.ordenante; 


        transaccion.Estado = accion === "Aceptar" ? "Aprobado" : "Cancelado";
        transaccion.FechaActualizacionRespuesta = new Date();

        if (accion === "Aceptar") {
            const beneficiario = await Ordenante.findOne({ NumeroCuenta: transaccion.NumeroCuentaBeneficiario });
      
            if (!beneficiario) {
              return res.status(400).json({ message: "Beneficiario no encontrado." });
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
  Notificacion.guardarNotificacion(transaccion.RFCOperador, mensaje, transaccion.IdComprobante);

  res.status(200).json({ message: `Transacción ${accion} con éxito.`, data: transaccion });
} catch (error) {
  console.error("Error al actualizar la transacción: ", error);
  handleHttpError(res,"Error al actualizar la transacción: ",500,error)
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
