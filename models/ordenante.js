const mongoose = require('mongoose');
const {Schema} =mongoose;

const OrdenanteSchema = new Schema({
    RFCOrdenante: {
        type:String,
        required:true,
        unique:true,
        match:/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/
    },
    NombreOrdenante: {
        type:String,
        required:true
    },
    ApPaterno: {
        type:String,
        required:true
    },
    ApMaterno: {
        type:String
    },
    Sexo: {
        type:String,
        required:true,
        enum:['M','F']
    },
    FechaNacimiento: {
        type:Date,
        required:true
    },
    NumeroCuenta: {
        type:String,
        required:true
    },
    Saldo: {
        type:Number,
        required:true
    },
    Estado: {
        type:String,
        required:true,
        enum:['Activo','Inactivo'],
        default:'Activo'
    },
    FechaRegistro: {
        type:Date,
        required:true
    },
    RFCOperador: {
        type:String,
        required:true
    },
    Telefono: {
        type:[{
            Lada: {
                type:String,
                required:true,
                match:/^\d{2,3}$/
            },
            Numero: {
                type:String,
                required:true,
                match:/^\d{7,10}$/
            }
        }],
        required:true,
        validate:[v=>v.length>0,'Debe tener al menos un teléfono']
    },
    Direccion: {
        NumeroInterior: {
            type:String,
            required:true
        },
        NumeroExterior: {
            type:String,
            required:true
        },
        Calle: {
            type:String,
            required:true
        },
        Colonia: {
            type:String,
            required:true
        },
        Ciudad: {
            type:String,
            required:true
        }
    },
    FechaUltimaModificacion: {
        type:Date,
        required:true
    },
});

const Ordenante = mongoose.model('Ordenante', OrdenanteSchema, "Ordenante");

module.exports = Ordenante;