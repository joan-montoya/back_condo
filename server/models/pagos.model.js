/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const pagosSchema = new Schema({
    idPersona: {
        type: mongoose.Types.ObjectId,
        ref: 'condominos'
    },
    strConcepto: {
        type: String,
        required: [true, 'Favor de insertar un concepto de pago.']
    },
    strFecha: {
        type: String,
        required: [true, 'Favor de insertar una fecha de pago.']
    },
    strImporte: {
        type: Number,
        required: [true, 'Favor de insertar el importe.']
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
    collection: "pagos"
});

module.exports = mongoose.model('Pagos', pagosSchema);