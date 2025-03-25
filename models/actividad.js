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
        Modificacion: {
          type: [
            {
              Anterior: {
                NombrePersonal: { type: String },
                ApPaterno: { type: String },
                ApMaterno: { type: String },
                CorreoElectronico: { type: String },
                Rol: { type: String },
                Direccion: {
                  NumeroInterior: { type: String },
                  NumeroExterior: { type: String },
                  Calle: { type: String },
                  Colonia: { type: String },
                  Ciudad: { type: String }
                },
                Telefono: {
                  type: [
                    {
                    Lada: { type: String },
                    Numero: { type: String }
                    }
                  ],
                  default: undefined, // Si no hay teléfono, no aparece el campo
                  validate: {
                      validator: function (arr) {
                          // Solo acepta si algún teléfono tiene datos
                          return arr.length === 0 || arr.some(tel => tel.Lada || tel.Numero);
                      },
                      message: "El teléfono debe contener al menos un número válido."
                  }
                },
                Estado: { type: String }
              },
              Actualizado: {
                NombrePersonal: { type: String },
                ApPaterno: { type: String },
                ApMaterno: { type: String },
                CorreoElectronico: { type: String },
                Rol: { type: String },
                Direccion: {
                  NumeroInterior: { type: String },
                  NumeroExterior: { type: String },
                  Calle: { type: String },
                  Colonia: { type: String },
                  Ciudad: { type: String }
                },
                Telefono: {
                  type: [
                    {
                    Lada: { type: String },
                    Numero: { type: String }
                    }
                  ],
                  default: undefined, // Si no hay teléfono, no aparece el campo
                  validate: {
                      validator: function (arr) {
                          // Solo acepta si algún teléfono tiene datos
                          return arr.length === 0 || arr.some(tel => tel.Lada || tel.Numero);
                      },
                      message: "El teléfono debe contener al menos un número válido."
                  }
                },
                Estado: { type: String }
              }
            }
          ],
          default: undefined
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