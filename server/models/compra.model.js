/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const compraSchema = new Schema({
    idPersona: {
        type: mongoose.Types.ObjectId,
        ref: 'usuario',
        required: [true, 'Favor de ingresar un identificador unico de persona.']
    },
    idAnimalito: {
        type: mongoose.Types.ObjectId,
        ref: 'mascota',
        required: [true, 'Favor de ingresar un identificador unico de la mascota.']
    },
    dteFechaCompra: {
        type: Date,
        required: [true, 'Favor de insertar la fecha de la compra']
    },
    nmbPrecio: Number,
    blnActivo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "compra"
});

module.exports = mongoose.model('Compra', compraSchema);