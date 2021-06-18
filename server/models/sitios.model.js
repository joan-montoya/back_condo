/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const sitioSchema = new Schema({
    strNombreSitio: {
        type: String,
        required: [true, 'Favor de insertar el nombre del sitio']
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "sitios"
});

sitioSchema.methods.setImgUrl = function setImgUrl () {
    
}

module.exports = mongoose.model('Compra', sitioSchema);