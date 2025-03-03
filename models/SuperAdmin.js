const mongoose = require("mongoose");

const SuperAdminSchema = new mongoose.Schema({
    RFC: { type: String, required: true, unique: true },
    NombrePersonal: { type: String, required: true },
    ApPaterno: { type: String, required: true },
    ApMaterno: { type: String },
    Sexo: { type: String },
    FechaNacimiento: { type: Date },
    CorreoElectronico: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Rol: { type: String, default: "superadmin", immutable: true },
    Direccion: { type: String },
    Telefono: { type: String }
});

module.exports = mongoose.model("SuperAdmin", SuperAdminSchema);
