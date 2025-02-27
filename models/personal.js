const mongoose = require("mongoose");
const { Schema } = mongoose;

// Esquema de la dirección
const DireccionSchema = new Schema({
  NumeroInterior: { type: String },
  NumeroExterior: { type: String },
  Calle: { type: String },
  Colonia: { type: String },
  Ciudad: { type: String }
});

// Esquema del teléfono
const TelefonoSchema = new Schema({
  Lada: { type: String, match: /^\d{2,3}$/ }, // 2 o 3 dígitos numéricos
  Numero: { type: String, match: /^\d{7,10}$/ } // 7 a 10 dígitos numéricos
});

// Esquema del Personal
const PersonalSchema = new Schema(
  {
    RFC: {
      type: String,
      match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/ // Validación de RFC
    },
    NombrePersonal: { type: String },
    ApPaterno: { type: String },
    ApMaterno: { type: String },
    Sexo: {
      type: String,
      enum: ["M", "F", "Otro"]
    },
    FechaNacimiento: { type: Date },
    CorreoElectronico: {
      type: String,
      lowercase: true, // Normaliza el email a minúsculas
      trim: true, // Elimina espacios en los extremos
      match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ // Validación de correo
    },
    Password: { type: String },
    Rol: {
      type: String,
      enum: ["Admin", "Operador"],
      default: "Operador"
    },
    Direccion: { type: DireccionSchema },
    Telefono: {
      type: [TelefonoSchema], 
      validate: {
        validator: function (v) {
          return v.length >= 1; // Debe haber al menos un teléfono
        },
        message: "Debe proporcionar al menos un número de teléfono."
      }
    },
    Estado: {
      type: String,
      enum: ["Activo", "Bloqueado", "Inactivo"],
      default: "Inactivo"
    }
  },
  {
    timestamps: { createdAt: "FechaCreacion", updatedAt: "FechaActualizacion" }
  }
);

// Crear el modelo
const Personal = mongoose.model("Personal", PersonalSchema, "Personal");

module.exports = Personal;
