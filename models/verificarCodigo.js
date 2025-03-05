const mongoose = require('mongoose');

const { Schema } = mongoose;

const VerificarCodigoSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personal',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 360, // Expira en 6 minutos (360 segundos)
  },
});

const VerificationCode = mongoose.model('VerificarCodigo', VerificarCodigoSchema, 'VerificarCodigo');

module.exports = VerificationCode;