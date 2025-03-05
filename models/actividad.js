/**
  Este esquema guarda el registro de actividades de cada empleado,
  se define que al crear un empleado se debe crear su registro de actividades
  y posteriormente se iran agregando  acciones asu registro de actividades 
  con Update.
  Cuando el usuario cambia de rol se debe crear un registro nuevo, pero con 
  diferente rol, para poder separar acciones por roles.
 */

const mongoose = require('mongoose');
const {Schema} = require('mongoose');

//Esquema de la coleccion de la actividad
const ActividadSchema = new Schema({
      RFC:{
        type: String,
        match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/ // Validación de RFC
      },
      NombreCompleto:{type:String},
      Rol:{
        type:String,
        enum:["Admin","Operador"]
      },
      Acciones:[{
        Accion: {
          type: String,
          enum: ["Inicio de sesión", "Cierre de sesión", "Registro", "Eliminación", "Actualización"],
          required: true,  // Asegúrate de que sea requerido
      },
      Detalles: {
          type: String,
          required: true,  // Asegúrate de que sea requerido
      },
      Fecha: {
          type: Date,
          default: Date.now,  // Default a la fecha actual si no se envía
          required: true,  // Asegúrate de que sea requerido
      },
      }],
    },
    {
      timestamps:{createdAt: "FechaCreacion",updatedAt: "FechaActualizacion"}
    }
);

//Crear y exportar modulo.
const Actividad = mongoose.model("Actividad", ActividadSchema,"Actividad");

module.exports = Actividad;