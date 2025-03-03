const mongoose = require('mongoose');

const { Schema } = mongoose;

// Esquema para verificar códigos de autenticación
const VerificarCodigoSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Personal', // Aquí se referencia la colección Personal
        required: true
    },
    code: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        index: { expires: '6m' } // Eliminación automática después de 10 minutos
    }
});

const VerificarCodigo = mongoose.model('VerificarCodigo', VerificarCodigoSchema, 'VerificarCodigo');

module.exports = VerificarCodigo;