const mongoose = require("mongoose");
const { Schema } = mongoose;

<<<<<<< HEAD
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
=======
const OrdenanteSchema = new Schema({
    RFCOrdenante: {
        type:String,
        required:false,
        unique:false,
        match:/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/
    },
    NombreOrdenante: {
        type:String,
        required:false
    },
    ApPaterno: {
        type:String,
        required:false
    },
    ApMaterno: {
        type:String
    },
    Sexo: {
        type:String,
        required:false,
        enum:['M','F']
    },
    FechaNacimiento: {
        type:Date,
        required:false
    },
    NumeroCuenta: {
        type:String,
        required:false
    },
    Saldo: {
        type:Number,
        required:false
    },
    Estado: {
        type:String,
        required:false,
        enum:['Activo','Inactivo'],
        default:'Activo'
    },
    FechaRegistro: {
        type:Date,
        required:false
    },
    RFCOperador: {
        type:String,
        required:false
    },
    Telefono: {
        type:[{
            Lada: {
                type:String,
                required:false,
                match:/^\d{2,3}$/
            },
            Numero: {
                type:String,
                required:false,
                match:/^\d{7,10}$/
            }
        }],
        required:false,
        validate:[v=>v.length>0,'Debe tener al menos un teléfono']
    },
    Direccion: {
        NumeroInterior: {
            type:String,
            required:false
        },
        NumeroExterior: {
            type:String,
            required:false
        },
        Calle: {
            type:String,
            required:false
        },
        Colonia: {
            type:String,
            required:false
        },
        Ciudad: {
            type:String,
            required:false
        }
    },
    FechaUltimaModificacion: {
        type:Date,
        required:false
>>>>>>> 9415fb7 (test/Añadir envio de notificaciones al Operador que solicito que se aceptra la transacción para que se informe si la transacción fue Aceptada o Rechazada)
    },
    FechaUltimaModificacion: { type: Date, default: Date.now }
});

const Ordenante = mongoose.model('Ordenante', OrdenanteSchema,"Ordenante");

module.exports = Ordenante;
