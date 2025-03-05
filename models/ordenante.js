const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrdenanteSchema = new mongoose.Schema({
    RFCOrdenante: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/ 
    },
    NombreOrdenante: { type: String, required: true },
    ApPaterno: { type: String, required: true },
    ApMaterno: { type: String },
    Sexo: { type: String, required: true, enum: ["M", "F"] },
    FechaNacimiento: { type: Date, required: true },
    NumeroCuenta: { type: String, required: true, unique: true },
    Saldo: { type: Number, required: true, min: 0 },
    Estado: { type: String, required: true, enum: ["Activo", "Inactivo", "Bloqueado"] },
    FechaRegistro: { type: Date, default: Date.now },
    RFCOperador: { type: String, required: true },
    Telefono: { 
        type: [String], 
        required: true, 
        validate: {
            validator: (arr) => arr.every(num => /^\d{7,10}$/.test(num)), 
            message: "Cada número debe tener entre 7 y 10 dígitos."
        }
    },
    Direccion: {
        NumeroInterior: { type: String },
        NumeroExterior: { type: String, required: true },
        Calle: { type: String, required: true },
        Colonia: { type: String, required: true },
        Ciudad: { type: String, required: true }
    },
    FechaUltimaModificacion: { type: Date, default: Date.now }
});

const Ordenante = mongoose.model('Ordenante', OrdenanteSchema,"Ordenante");

module.exports = Ordenante;
