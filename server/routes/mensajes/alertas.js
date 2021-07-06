/*jshint esversion: 9*/
const AlertasModel = require('../../models/alertas.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/usuario/
app.get('/', async(req, res) => {
    try {
        if (req.query.idPersona) req.queryMatch._id = req.query.idPersona;
        if (req.query.termino) req.queryMatch.$or = Helper(["strNombre", "strCorreo"], req.query.termino);

        const mensaje = await AlertasModel.aggregate([   
            {
                $lookup: {
                    from: 'condominos', //Nombre de la tabla
                    localField: 'strRemitente', //En que campo lo tengo
                    foreignField: '_id',
                    as: 'Usuario'
                }
            },
            {
                $project: {
                    'id': 1,
                    '_id':'$_id',
                    'blnActivo':'$blnActivo',
                    'strMensaje':'$strMensaje',
                    'strRemitente':'$strRemitente',
                    'Remitente': {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$Usuario',
                                        as: 'usuario',
                                        cond: {
                                            $eq: ['$strRemitente', '$$usuario._id']
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
                msg: 'No se encontraron mensajes en la base de datos.',
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
        const men = new AlertasModel(req.body);

        let err = men.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el usuario.',
                cont: {
                    err
                }
            });
        }

        const usuarioEncontrado = await AlertasModel.findOne({ strCorreo: { $regex: `^${men.strCorreo}$`, $options: 'i' } });
        if (usuarioEncontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'El correo del usuario que desea registrar ya se encuentra en uso.',
            cont: {
                Correo: usuarioEncontrado.strCorreo
            }
        });

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
            email.sendEmail(req.body.strCorreo);
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
            msg: 'Error al registrar al usuario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/usuario/?idPersona=603939becf1db633f87595b2
app.put('/', async(req, res) => {
    try {

        const idAlerta = req.query.idAlerta;

        if (idAlerta == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idAlerta;

        const personaEncontrada = await AlertasModel.findById(idAlerta);

        if (!personaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la persona en la base de datos.',
                cont: personaEncontrada
            });

        const newPersona = new AlertasModel(req.body);

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

        const personaActualizada = await AlertasModel.findByIdAndUpdate(idAlerta, { $set: newPersona }, { new: true });

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