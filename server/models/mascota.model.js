/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const mascotaSchema = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de insertar el nombre de la mascota.']
    },
    strTipoAnimal: {
        type: String,
        required: [true, 'Favor de insertar que tipo de animal es.']
    },
    nmbEdad: Number,
    strSexo: String,
    blnActivo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "mascota"
});

module.exports = mongoose.model('Mascota', mascotaSchema);