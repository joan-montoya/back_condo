/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const lugaresSchema = new Schema({
    strNombrelugar: {
        type: String,
        required: [true, 'Favor de insertar un Nombre de lugar.']
    },
    strDescripcion: {
        type: String,
        required: [true, 'Favor de insertar una descripcion del lugar.']
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
    collection: "lugares"
});

module.exports = mongoose.model('Lugares', lugaresSchema);