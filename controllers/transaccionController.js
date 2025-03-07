const Transaccion = require("../models/transaccion");
const Ordenante = require("../models/ordenante");


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
   

res.status(200).json({ message: `Transacción ${accion} con éxito.`, data: transaccion });
} catch (error) {
console.error("Error al actualizar la transacción: ", error);
res.status(500).json({ message: "Error interno del servidor." });
}
};
