const mongoose = require('mongoose');
const {Schema} = mongoose;

const NotificacionSchema = new mongoose.Schema({
    RFCOperador: String,
    mensaje: String,
    transaccionId: String,
    estado: { type: String, default: 'Pendiente', enum: ["Pendiente", "Leída"]}, 
    fecha: { type: Date, default: Date.now },
    tipoNotificacion: {
        type: String,
        enum: ['General', 'SolicitudTransaccion'],
        default: 'General'
    },
    DatosTransaccion: {
        IdComprobante: String,
        NombreOrdenante: String,
        NombreBeneficiario: String,
        Monto: String
    }
});

const Notificacion = mongoose.model('Notificacion', NotificacionSchema, "Notificacion");

module.exports = Notificacion;