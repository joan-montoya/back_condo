/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const marketSchema = new Schema({
    strDueño: {
        type: mongoose.Types.ObjectId,
        ref: 'condominos'
    },
    strNombreProducto: {
        type: String,
        required: [true, 'Favor de insertar el nombre del producto.']
    },
    strDescripcion: {
        type: String,
        required: [true, 'Favor de insertar una descripcion.']
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
    collection: "market"
});

module.exports = mongoose.model('Market', marketSchema);