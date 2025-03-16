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
      match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/ // Validación de RFC
    },
    NombrePersonal: { type: String, required: true },
    ApPaterno: { type: String, required: true },
    ApMaterno: { type: String },
    Sexo: { type: String, enum: ["M", "F", "Otro"], required: true },
    FechaNacimiento: { type: Date, required: true },
    CorreoElectronico: {
      type: String,
      required: true,
      lowercase: true, // Normaliza el email a minúsculas
      trim: true, // Elimina espacios en los extremos
      match: /^\S+@\S+\.\S+$/ // Validación de correo
    },
    Password: { type: String, required: true },
    Rol: {
      type: String,
      enum: ["SuperAdmin", "Admin", "Operador"],
      default: "Operador",
      immutable: function () {
        return this.Rol === "SuperAdmin";
      } // Evita modificar el rol si es SuperAdmin
    },
    Direccion: { type: DireccionSchema, required: true },
    Telefono: {
      type: [TelefonoSchema],
      required: true,
      validate: [v => v.length > 0, 'Debe tener al menos un teléfono']
    },
    Estado: {
      type: String,
      required: true,
      enum: ["Activo", "Bloqueado", "Inactivo"],
      default: "Inactivo"
    }
  }, {
    timestamps: {
      createdAt: "FechaCreacion",
      updatedAt: "FechaActualizacion"
    }
  });

// Evitar eliminación del SuperAdmin
PersonalSchema.pre("deleteOne", { document: true, query: false }, function (next) {
  if (this.Rol === "SuperAdmin") {
    const error = new Error("No se puede eliminar al SuperAdmin.");
    return next(error);
  }
  next();
});

// Crear el modelo
const Personal = mongoose.model("Personal", PersonalSchema, "Personal");

module.exports = Personal;