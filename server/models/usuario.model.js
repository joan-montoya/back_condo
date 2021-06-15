/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de insertar el nombre.']
    },
    strApellidos: {
        type: String,
        required: [true, 'Favor de insertar sus apellidos.']
    },
    nmbEdad: {
        type: Number,
        required: [true, 'Favor de insertar su edad.']
    },
    strCorreo: {
        type: String,
        required: [true, 'Favor de insertar su correo.']
    },
    strDireccion: String,
    strTelefono: String,
    arrMascotas: [{
        type: mongoose.Types.ObjectId,
        ref: 'mascota'
    }],
    blnActivo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "usuario"
});

module.exports = mongoose.model('Usuario', userSchema);