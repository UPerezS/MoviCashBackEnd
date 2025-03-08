const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    },
    FechaUltimaModificacion: { type: Date, default: Date.now }
});

const Ordenante = mongoose.model('Ordenante', OrdenanteSchema,"Ordenante");

module.exports = Ordenante;
