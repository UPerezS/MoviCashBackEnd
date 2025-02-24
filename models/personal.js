const mongoose = require('mongoose');
const { Schema } = mongoose;

// Esquema de la dirección
const DireccionSchema = new Schema({
    NumeroInterior: { type: String },
    NumeroExterior: { type: String, required: true },
    Calle: { type: String, required: true },
    Colonia: { type: String, required: true },
    Ciudad: { type: String, required: true }
});

// Esquema del teléfono
const TelefonoSchema = new Schema({
    Lada: { type: String, required: true, match: /^\d{2,3}$/ },
    Numero: { type: String, required: true, match: /^\d{7,10}$/ }
});

// Esquema del Personal
const PersonalSchema = new Schema({
    RFC: { 
        type: String, 
        required: true, 
        match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/ 
    },
    NombrePersonal: { type: String, required: true },
    ApPaterno: { type: String, required: true },
    ApMaterno: { type: String },
    Sexo: { 
        type: String, 
        required: true, 
        enum: ['Masculino', 'Femenino', 'Otro'] 
    },
    FechaNacimiento: { type: Date, required: true },
    CorreoElectronico: { 
        type: String, 
        required: true, 
        match: /^\S+@\S+\.\S+$/ 
    },
    Password: { type: String, required: true },
    Rol: { 
        type: String, 
        required: true, 
        enum: ['Admin', 'Operador'] 
    },
    FechaCreacion: { type: Date, default: Date.now },
    Direccion: { type: DireccionSchema, required: true },
    Telefono: { type: [TelefonoSchema], required: true, validate: [arrayLimit, '{PATH} debe tener al menos un elemento'] },
    Estado: { 
        type: String, 
        required: true, 
        enum: ['Activo', 'Bloqueado', 'Inactivo'] 
    },
    TokenVerificacion: { type: String },
    EstadoVerificacion: { type: Boolean },
    FechaUltimaModificacion: { type: Date }
});

// Función de validación para el array de teléfonos
function arrayLimit(val) {
    return val.length >= 1;
}

// Crear el modelo
const Personal = mongoose.model('Personal', PersonalSchema);

module.exports = Personal;