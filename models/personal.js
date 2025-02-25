const mongoose = require('mongoose');
const { Schema } = mongoose;

// Esquema de la dirección
const DireccionSchema = new Schema({
    NumeroInterior: { type: String },
    NumeroExterior: { type: String, required: false },
    Calle: { type: String, required: false },
    Colonia: { type: String, required: false },
    Ciudad: { type: String, required: false }
});

// Esquema del teléfono
const TelefonoSchema = new Schema({
    Lada: { type: String, required: false, match: /^\d{2,3}$/ },
    Numero: { type: String, required: false, match: /^\d{7,10}$/ }
});

// Esquema del Personal
const PersonalSchema = new Schema(
    {
        RFC: {
            type: String,
            required: false,
            match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/
        },
        NombrePersonal: { type: String, required: false },
        ApPaterno: { type: String, required: false },
        ApMaterno: { type: String },
        Sexo: {
            type: String,
            required: false,
            enum: ['M', 'F', 'Otro'],

        },
        FechaNacimiento: { type: Date, required: false },
        CorreoElectronico: {
            type: String,
            required: false,
            lowercase: false,
            trim: true,
            match: /^\S+@\S+\.\S+$/,

        },
        Password: { type: String, required: false },
        Rol: {
            type: String,
            required: false,
            enum: ['Admin', 'Operador'],
            default: 'Operador'
        },
        Direccion: { type: DireccionSchema, required: false },
        //Telefono: { type: [TelefonoSchema], required: false, validate: [arrayLimit, '{PATH} debe tener al menos un elemento'] },
        Estado: {
            type: String,
            required: false,
            enum: ['Activo', 'Bloqueado', 'Inactivo'],
            default: 'Inactivo'
        },
    },
    {
        timestamps:{
            createdAt:'FechaCreacion',
            updatedAt:'FechaActualizacion'
        }
    }
);

// Función de validación para el array de teléfonos
function arrayLimit(val) {
    return val.length >= 1;
}

// Crear el modelo
const Personal = mongoose.model('Personal', PersonalSchema, "Personal");

mongoose.set("debug", false)

module.exports = Personal;