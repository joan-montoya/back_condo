/*jshint esversion: 9*/
const VisitasModel = require('../../models/visitas.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/visitas/
app.get('/', async(req, res) => {
    try {
        if (req.query.idPersona) req.queryMatch._id = req.query.idPersona;
        if (req.query.termino) req.queryMatch.$or = Helper(["strNombre", "strCorreo"], req.query.termino);

        const visita = await VisitasModel.aggregate([   
            {
                $lookup: {
                    from: 'condominos', //Nombre de la tabla
                    localField: 'IdPersona', //En que campo lo tengo
                    foreignField: '_id',
                    as: 'Usuario'
                }
            },
            {
                $project: {
                    '_id': 1,
                    'strNombreVisita':1,
                    'strFechaEntrada':1,
                    'strFechaSalida':1,
                    'strMotivo':1,
                    'IdPersona':1,
                    'created_at':1,
                    'updated_at':1,
                    'blnActivo':1,
                    'Persona': {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$Usuario',
                                        as: 'usuario',
                                        cond: {
                                            $eq: ['$IdPersona', '$$usuario._id']
                                        }
                                    }
                                }, 0
                            ]

                        },
                }
            }
        ])

        if (visita.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron visitas en la base de datos.',
                cont: {
                    visita
                } 
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    visita
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a los usuarios.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/visitas/
app.post('/', async(req, res) => {

    try {
        const vis = new VisitasModel(req.body);

        let err = vis.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la visita.',
                cont: {
                    err
                }
            });
        }

        const visita = await vis.save();
        if (visita.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar la visita en la base de datos.',
                cont: {
                    visita
                }
            });
        } else {
            email.sendEmail(req.body.strCorreo);
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    visita
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la visita.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/visitas/?idVisitas=603939becf1db633f87595b2
app.put('/', async(req, res) => {
    try {

        const idVisita = req.query.idVisita;

        if (idVisita == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idVisita;

        const visitaEncontrada = await VisitasModel.findById(idVisita);

        if (!visitaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la visita en la base de datos.',
                cont: visitaEncontrada
            });

        const newVisita = new VisitasModel(req.body);

        let err = newVisita.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la visita.',
                cont: {
                    err
                }
            });
        }

        const visitaActualizada = await VisitasModel.findByIdAndUpdate(idVisita, { $set: newVisita }, { new: true });

        if (!visitaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar la visita.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo la visita correctamente.',
                cont: {
                    visitaActualizada
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar la visita.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/visitas/?idVisita=603939becf1db633f87595b2
app.delete('/', async(req, res) => {

    try {

        if (req.query.idVisita == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        idVisita = req.query.idVisita;
        blnActivo = req.body.blnActivo;

        const visitaEncontrada = await VisitasModel.findById(idVisita);

        if (!visitaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la visita en la base de datos.',
                cont: visitaEncontrada
            });

        const visitaActualizada = await VisitasModel.findByIdAndUpdate(idVisita, { $set: { blnActivo: 'false' } }, { new: true });

        if (!visitaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar eliminar la visita.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Se a ${blnActivo === 'true'? 'activado': 'desactivado'} la visita correctamente.`,
                cont: {
                    visitaActualizada
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al eliminar a la visita.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});


module.exports = app;