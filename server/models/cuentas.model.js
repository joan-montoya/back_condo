/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const cuentasSchema = new Schema({
    idPersona: {
        type: mongoose.Types.ObjectId,
        ref: 'condominos'
    },
    strNumTarjeta: {
        type: String,
        required: [true, 'Favor de insertar un numero de tarjeta.']
    },
    strCvv: {
        type: String,
        required: [true, 'Favor de insertar un numero de seguridad.']
    },
    strPin: {
        type: String,
        required: [true, 'Favor de insertar su pin.']
    },
    nmbSaldo: {
        type: Number,
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
    collection: "cuentas"
});

module.exports = mongoose.model('Cuentas', cuentasSchema);