const Ordenante = require("../models/ordenante");
const Notificacion = require("../services/notificacionService");
const handleHttpError = require("../utils/handleHttpError");



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

