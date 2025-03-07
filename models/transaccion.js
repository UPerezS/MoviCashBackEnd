const mongoose = require('mongoose');
const { Schema } = mongoose;

// Esquema de la transacción
const TransaccionSchema = new Schema({
    IdComprobante: {type: String,required: true,unique: true},
    ClaveRastreo: {type: String,required: true,unique: true},
    NumeroCuentaOrdenante: {type: String,required: true},
    NombreCompletoOrdenante: {type: String,required: true},
    NombreCompletoBeneficiario: {type: String,required: true},
    NumeroCuentaBeneficiario: {type: String, required: true},
    RFCOperador: {type: String,required: true},
    NombreCompletoOperador: {type: String,required: true},
    Monto: {type: Number,required: true,min: 0},
    Tipo: {type: String,required: true,enum: ['Transferencia', 'Depósito', 'Otro']},
    Estado: {type: String,required: true,
             enum: ['Aprobado', 'Pendiente', 'Cancelado']},
    Fecha: {
        type: Date,required: true, description: 'Fecha de realización',
    },
    Concepto: {
        type: String,
        description: 'Concepto de la transacción',
    },
}, {
    timestamps: {
        createdAt: 'Fecha',
        updatedAt: 'FechaActualizacionRespuesta',
    },
});

// Crear el modelo
const Transaccion = mongoose.model('Transaccion', TransaccionSchema, "Transaccion");

module.exports = Transaccion;
