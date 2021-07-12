/*jshint esversion: 9*/
const MarketModel = require('../../models/market.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();


// http://localhost:3000/api/ventas/
app.get('/', async(req, res) => {
    try {
        

        const mensaje = await MarketModel.aggregate([   
            {
                $lookup: {
                    from: 'condominos', //Nombre de la tabla
                    localField: 'strDueño', //En que campo lo tengo
                    foreignField: '_id',
                    as: 'Usuario'
                }
            },
            {
                $project: {
                    '_id': 1,
                    '_id':'$_id',
                    'strNombreProducto':'$strNombreProducto',
                    'strDescripcion':'$strDescripcion',
                    'Persona': {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$Usuario',
                                        as: 'usuario',
                                        cond: {
                                            $eq: ['$strDueño', '$$usuario._id']
                                        }
                                    }
                                }, 0
                            ]

                        },
                    
                    'created_at':1,
                    'updated_at':1,
                }
            }
            
        ])
        if (mensaje.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron publicaciones en la base de datos.',
                cont: {
                    mensaje
                } 
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    mensaje
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a los mensajes.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/usuario/
app.post('/', async(req, res) => {

    try {
        const men = new MarketModel(req.body);

        let err = men.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la venta.',
                cont: {
                    err
                }
            });
        }

        const mensaje = await men.save();
        if (mensaje.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el mensaje en la base de datos.',
                cont: {
                    mensaje
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    mensaje
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la venta.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/usuario/?idPersona=603939becf1db633f87595b2
app.put('/', async(req, res) => {
    try {

        const idVenta = req.query.idVenta;

        if (idVenta == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idVenta;

        const ventaEncontrada = await MarketModel.findById(idVenta);

        if (!ventaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la publicacion en la base de datos.',
                cont: ventaEncontrada
            });

        const newVenta = new MarketModel(req.body);

        let err = newVenta.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la publicacion.',
                cont: {
                    err
                }
            });
        }

        const ventaActualizada = await MarketModel.findByIdAndUpdate(idVenta, { $set: newVenta }, { new: true });

        if (!ventaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar la venta.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo la publicacion correctamente.',
                cont: {
                    ventaActualizada
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar la venta.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/usuario/?idPersona=603939becf1db633f87595b2
app.delete('/', async(req, res) => {

    try {

        if (req.query.idPersona == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        idPersona = req.query.idPersona;
        blnActivo = req.body.blnActivo;

        const personaEncontrada = await UsuarioModel.findById(idPersona);

        if (!personaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la persona en la base de datos.',
                cont: personaEncontrada
            });

        const personaActualizada = await UsuarioModel.findByIdAndUpdate(idPersona, { $set: { blnActivo } }, { new: true });

        if (!personaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar eliminar la persona.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Se a ${blnActivo === 'true'? 'activado': 'desactivado'} la persona correctamente.`,
                cont: {
                    personaActualizada
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al eliminar a la persona.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});


module.exports = app;