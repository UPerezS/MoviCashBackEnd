const mongoose = require('mongoose');
const {Schema} =mongoose;

const NotificacionSchema = new mongoose.Schema({
    RFCOperador: String,
    mensaje: String,
    transaccionId: String,
    estado: { type: String, default: 'Pendiente', enum: ["Pendiente", "Leída"]}, 
    fecha: { type: Date, default: Date.now }
});

const Notificacion = mongoose.model('Notificacion', NotificacionSchema,"Notificacion");

module.exports = Notificacion;
