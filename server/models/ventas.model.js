/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ventasSchema = new Schema({
    strRemitente: {
        type: mongoose.Types.ObjectId,
        ref: 'condominos'
    },
    strventa: {
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
    collection: "ventas"
});

ventasSchema.methods.setImgUrl = function setImgUrl () {
    
}

module.exports = mongoose.model('Ventas', ventasSchema);