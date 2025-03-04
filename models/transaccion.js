const mongoose = require("mongoose");
const { Schema } = mongoose;

// Esquema de la transacción
const TransaccionSchema = new Schema(
  {
    IdComprobante: { type: String, required: true },
    ClaveRastreo: { type: String, required: true },
    
    Ordenante: {
      NumeroCuenta: { type: String, required: true },
      NombreCompleto: { type: String, required: true }
    },

    Beneficiario: {
      NumeroCuenta: { type: String, required: true },
      NombreCompleto: { type: String, required: true }
    },

    Operador: {
      RFC: { type: String, required: true },
      NombreCompleto: { type: String, required: true }
    },

    Monto: { type: Number, required: true },
    Tipo: { type: String, required: true, enum: ["Transferencia", "Otro"] },
    Estado: { type: String, required: true, enum: ["Pendiente", "Completado", "Cancelado"] },
    
    Fecha: { type: Date, required: true, default: Date.now },
    Concepto: { type: String, required: true }
  },
  {
    timestamps: { createdAt: "FechaCreacion", updatedAt: "FechaActualizacion" }
  }
);

// Crear el modelo
const Transaccion = mongoose.model("Transaccion", TransaccionSchema, "Transacciones");

module.exports = Transaccion;
