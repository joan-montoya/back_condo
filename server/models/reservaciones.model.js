/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservacionesSchema = new Schema({
    idPersonaReserva: {
        type: mongoose.Types.ObjectId,
        ref: 'condominos'
    },
    idLugar: {
        type: mongoose.Types.ObjectId,
        ref: 'lugares'
    },
    dtaFechaInicio: {
        type: String,
        required: [true, 'Favor de insertar una fecha de inicio.']
    },
    dtaFechaTermino: {
        type: String,
        required: [true, 'Favor de insertar una fecha de termino.']
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
    collection: "reservaciones"
});

module.exports = mongoose.model('Reservaciones', reservacionesSchema);