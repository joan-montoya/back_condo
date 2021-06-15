const mongoose = require('mongoose');
const { Schema } = mongoose;

const visitasSchema = new Schema({
    IdPersona: {
        type: mongoose.Types.ObjectId,
        ref: 'condominos'
    },
    strNombreVisita: {
        type: String,
        required: [true, 'Favor de insertar un nombre de visitante.']
    },
    strMotivo: {
        type: String,
        required: [true, 'Favor de insertar un motivo.']
    },
    strFechaEntrada: {
        type: String,
        required: [true, 'Favor de insertar una fecha.']
    },
    strFechaSalida: {
        type: String,
        required: [true, 'Favor de insertar una fecha.']
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
    collection: "visitas"
});

module.exports = mongoose.model('Visitas', visitasSchema);