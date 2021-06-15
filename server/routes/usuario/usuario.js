/*jshint esversion: 9*/
const UsuarioModel = require('../../models/usuario.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/usuario/
app.get('/', async(req, res) => {
    try {
        if (req.query.idPersona) req.queryMatch._id = req.query.idPersona;
        if (req.query.termino) req.queryMatch.$or = Helper(["strNombre", "strCorreo"], req.query.termino);

        const usuario = await UsuarioModel.find({...req.queryMatch }).populate({ path: 'idMascota', select: { 'strNombre': 1, '_id': 0 } });

        if (usuario.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron usuarios en la base de datos.',
                cont: {
                    usuario
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    usuario
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
        const user = new UsuarioModel(req.body);

        let err = user.validateSync();

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

        const usuarioEncontrado = await UsuarioModel.findOne({ strCorreo: { $regex: `^${user.strCorreo}$`, $options: 'i' } });
        if (usuarioEncontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'El correo del usuario que desea registrar ya se encuentra en uso.',
            cont: {
                Correo: usuarioEncontrado.strCorreo
            }
        });

        const usuario = await user.save();
        if (usuario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el usuario en la base de datos.',
                cont: {
                    usuario
                }
            });
        } else {
            email.sendEmail(req.body.strCorreo);
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    usuario
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