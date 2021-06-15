/*jshint esversion: 9*/
const VisitasModel = require('../../models/visitas.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/usuario/
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

// http://localhost:3000/api/usuario/
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

// http://localhost:3000/api/usuario/?idPersona=603939becf1db633f87595b2
app.put('/', async(req, res) => {
    try {

        const idPersona = req.query.idPersona;

        if (idPersona == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idPersona;

        const personaEncontrada = await UsuarioModel.findById(idPersona);

        if (!personaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la persona en la base de datos.',
                cont: personaEncontrada
            });

        const newPersona = new UsuarioModel(req.body);

        let err = newPersona.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la persona.',
                cont: {
                    err
                }
            });
        }

        const personaActualizada = await UsuarioModel.findByIdAndUpdate(idPersona, { $set: newPersona }, { new: true });

        if (!personaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar la persona.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo la persona correctamente.',
                cont: {
                    personaActualizada
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar la persona.',
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