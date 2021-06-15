/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const comunicadoSchema = new Schema({
    strRemitente: {
        type: mongoose.Types.ObjectId,
        ref: 'condominos'
    },
    strComunicado: {
        type: String,
        required: [true, 'Favor de insertar un mensaje.']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "comunicado"
});

module.exports = mongoose.model('Comunicado', comunicadoSchema);