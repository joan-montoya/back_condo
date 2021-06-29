/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const condoSchema = new Schema({
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
    strPassword: {
        type: String,
        require: [true, 'Todo usuario necesita una contraseña']
    },
    strDireccion:{
        type: String,
        required: [true, 'Favor de insertar su direccion.']
    },
    strTelefono:{
        type: String,
        required: [true, 'Favor de insertar su telefono.']
    },
    // arrMascotas: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'mascota'
    // }],
    blnActivo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "condominos"
});

module.exports = mongoose.model('Condominos', condoSchema);