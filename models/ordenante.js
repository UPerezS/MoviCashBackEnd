<<<<<<< HEAD
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Esquema de Dirección
const DireccionSchema = new Schema({
  NumeroInterior: { type: String, default: "" },
  NumeroExterior: { type: String, required: true },
  Calle: { type: String, required: true },
  Colonia: { type: String, required: true },
  Ciudad: { type: String, required: true }
});

// Esquema de Ordenante
const OrdenanteSchema = new Schema(
  {
    RFCOrdenante: {
      type: String,
      required: true,
      match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/, // Validación RFC
      unique: true
    },
    NombreOrdenante: { type: String, required: true },
    ApPaterno: { type: String, required: true },
    ApMaterno: { type: String, required: true },
    Sexo: {
      type: String,
      enum: ["M", "F"],
      required: true
    },
    FechaNacimiento: { type: Date, required: true },
    NumeroCuenta: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{10}$/ // 10 dígitos numéricos
    },
    Saldo: { type: Number, required: true, min: 0 },
    Estado: {
      type: String,
      enum: ["Activo", "Bloqueado", "Inactivo"],
      default: "Activo"
    },
    RFCOperador: {
      type: String,
      required: true,
      match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/ // Validación RFC
    },
    Telefono: [
      {
        type: String,
        match: /^\d{10}$/, // 10 dígitos numéricos
        required: true
      }
    ],
    Direccion: { type: DireccionSchema, required: true }
  },
  {
    timestamps: { createdAt: "FechaRegistro", updatedAt: "FechaUltimaModificacion" }
  }
);

// Crear el modelo
const Ordenante = mongoose.model("Ordenante", OrdenanteSchema, "Ordenante");

module.exports = Ordenante;
=======
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
>>>>>>> 35a6c5e (CRUD de ordenante)
