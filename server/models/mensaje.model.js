/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const mensajeSchema = new Schema({
    strRemitente: {
        type: mongoose.Types.ObjectId,
        ref: 'condominos'
    },
    strReceptor: {
        type: mongoose.Types.ObjectId,
        ref: 'condominos'
    },
    strMensaje: {
        type: String,
        required: [true, 'Favor de insertar un mensaje.']
    },
    blnActivo: {
        type: Boolean,
        default: true
    },
    blnLeido: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "mensaje"
});

module.exports = mongoose.model('Mensaje', mensajeSchema);