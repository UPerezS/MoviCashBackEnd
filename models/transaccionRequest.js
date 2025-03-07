const mongoose = require('mongoose');

const transaccionRequestSchema = new mongoose.Schema({
  IdComprobante: {
    type: String,
    required: true
  },
  ClaveRastreo: {
    type: String,
    required: true
  },
  NumeroCuentaOrdenante: {
    type: String
  },
  NombreCompletoOrdenante: {
    type: String
  },
  NumeroCuentaBeneficiario: {
    type: String,
    required: true
  },
  NombreCompletoBeneficiario: {
    type: String,
    required: true
  },
  RFCOperador: {
    type: String
  },
  NombreCompletoOperador: {
    type: String
  },
  Monto: {
    type: Number,
    required: true,
    min: 0
  },
  Tipo: {
    type: String,
    required: true
  },
  Estado: {
    type: String,
    enum: ['Aprobado', 'Pendiente', 'Cancelado'],
    default: 'Pendiente',
    required: true
  },
  Fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  Concepto: {
    type: String
  },
}, 
);

module.exports = mongoose.model('TransaccionModel', transaccionRequestSchema, "Transaccion");
