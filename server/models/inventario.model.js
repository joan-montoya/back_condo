/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
let schemaopcion = {
//     timestamps: {
//         createdAt: 'created_at',
//         updatedAt: 'updated_at'
//     },
    collection: "inventario"
}
const inventarioSchema = new Schema({
    idAnimalito: {
        type: Schema.Types.ObjectId,
        ref: 'mascota',
    },
    nmbCantidad: {
        type: Number,
        required: [true, 'Favor de insertar su cantidad.']
    },
    strCategoria: {
        type: String,
        required: [true, 'Inserte Categoria.']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },} 
);

module.exports = mongoose.model('Inventario', inventarioSchema);