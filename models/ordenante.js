const mongoose = require('mongoose');
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
        type: String },
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
        required: true, min: 0 
    },
    Estado: {
        type: String,
        required: true,
        enum: ['Activo', 'Inactivo', 'Bloqueado'], 
        default: 'Activo'
    },
    FechaRegistro: { 
        type: Date, required: true 
    },
    RFCOperador: { 
        type: String, 
        required: true 
    },
    Telefono: {
        type: [String], 
        required: true,
        match: [/^\d{7,10}$/, 'El teléfono debe tener entre 7 y 10 dígitos']
    },
    Direccion: {
        NumeroInterior: { 
            type: String
         },
        NumeroExterior: { 
            type: String, 
            required: true 
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
            required: true }
    },
    FechaActualizacion: { type: Date, required: true } // Se cambió el nombre
});

const Ordenante = mongoose.model('Ordenante', OrdenanteSchema, "Ordenante");

module.exports = Ordenante;
