const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrdenanteSchema = new Schema({
    RFCOrdenante: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/
    },
    NombreOrdenante: {
        type: String,
        required: true
    },
    ApPaterno: {
        type: String,
        required: true
    },
    ApMaterno: {
        type: String
    },
    Sexo: {
        type: String,
        required: true,
        enum: ['M', 'F']
    },
    FechaNacimiento: {
        type: Date,
        required: true
    },
    NumeroCuenta: {
        type: String,
        required: true
    },
    Saldo: {
        type: Number,
        required: true,
        min: 0 // Evita valores negativos
    },
    Estado: {
        type: String,
        required: true,
        enum: ['Activo', 'Inactivo', 'Bloqueado'], // Se agregó "Bloqueado"
        default: 'Activo'
    },
    FechaRegistro: {
        type: Date,
        required: true
    },
    RFCOperador: {
        type: String,
        required: true
    },
    Telefono: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0 && v.every(num => /^\d{7,10}$/.test(num));
            },
            message: "Debe proporcionar al menos un número telefónico válido de 7 a 10 dígitos"
        }
    },
    Direccion: {
        NumeroExterior: {
            type: String,
            required: true
        },
        NumeroInterior: {
            type: String
        },
        Calle: {
            type: String,
            required: true
        },
        Colonia: {
            type: String,
            required: true
        },
        Ciudad: {
            type: String,
            required: true
        }
    },
    FechaActualizacion: {
        type: Date,
        default: Date.now // Se actualiza manualmente en el código cuando se edita un documento
    }
}, 
{
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaUltimaModificacion' }
});

const Ordenante = mongoose.model('Ordenante', OrdenanteSchema, "Ordenante");

module.exports = Ordenante;
