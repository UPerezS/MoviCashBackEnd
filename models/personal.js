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
const PersonalSchema = new Schema({
    RFC: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/, // RFC válido
    },
    NombrePersonal: { type: String, required: true },
    ApPaterno: { type: String, required: true },
    ApMaterno: { type: String },
    Sexo: {
      type: String,
      required: true,
      enum: ['M', 'F'], // Solo M o F
    },
    FechaNacimiento: { type: Date, required: true },
    CorreoElectronico: {
      type: String,
      required: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/, // Correo válido
    },
    Password: { type: String, required: true },
    Rol: {
      type: String,
      required: true,
      enum: ['Admin', 'Operador'],
      default: 'Operador',
    },
    Direccion: { type: DireccionSchema, required: true },
    Telefono: {
      type: [TelefonoSchema],
      required: true,
      validate: [v => v.length > 0, 'Debe tener al menos un teléfono'],
    },
    Estado: {
      type: String,
      required: true,
      enum: ['Activo', 'Bloqueado', 'Inactivo'],
      default: 'Inactivo',
    },
  }, {
    timestamps: {
      createdAt: 'FechaCreacion',
      updatedAt: 'FechaActualizacion',
    },
  });

// Función de validación para el array de teléfonos
function arrayLimit(val) {
    return val.length >= 1;
}

// Crear el modelo
const Personal = mongoose.model('Personal', PersonalSchema, "Personal");



module.exports = Personal;