/*jshint esversion: 9*/
const LugaresModel = require('../../models/lugares.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/lugares/
app.get('/', async(req, res) => {
    try {

        const lugar = await LugaresModel.find();
        if (lugar.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron lugares en la base de datos.',
                cont: {
                    lugar
                } 
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    lugar
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a los lugares.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/lugares/
app.post('/', async(req, res) => {

    try {
        const lug = new LugaresModel(req.body);

        let err = lug.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el lugar.',
                cont: {
                    err
                }
            });
        }

        const lugarEncontrado = await LugaresModel.findOne({ strNombrelugar: { $regex: `^${lug.strNombrelugar}$`, $options: 'i' } });
        if (lugarEncontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'El nombre del lugar que desea registrar ya se encuentra en uso.',
            cont: {
                Correo: lugarEncontrado.strNombreLugar
            }
        });

        const lugar = await lug.save();
        if (lugar.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el lugar en la base de datos.',
                cont: {
                    lugar
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    lugar
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar el lugar.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/lugar/?idLugar=603939becf1db633f87595b2
app.put('/', async(req, res) => {
    try {

        const idLugar = req.query.idLugar;

        if (idLugar == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idLugar;

        const lugarEncontrada = await LugaresModel.findById(idLugar);

        if (!lugarEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el lugar en la base de datos.',
                cont: lugarEncontrada
            });

        const newLugar = new LugaresModel(req.body);

        let err = newLugar.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el lugar.',
                cont: {
                    err
                }
            });
        }

        const lugarActualizado = await LugaresModel.findByIdAndUpdate(idLugar, { $set: newLugar }, { new: true });

        if (!lugarActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar el lugar.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo el lugar correctamente.',
                cont: {
                    lugarActualizado
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar el lugar.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/lugares/?idLugar=603939becf1db633f87595b2
app.delete('/', async(req, res) => {

    try {

        idLugar = req.query.idLugar;
        blnActivo = req.body.blnActivo;

        if (req.query.idLugar == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        const lugarEncontrado = await LugaresModel.findById(idLugar);

        if (!lugarEncontrado)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el lugar en la base de datos.',
                cont: lugarEncontrado
            });

        const lugarActualizado = await LugaresModel.findByIdAndUpdate(idLugar, { $set: { blnActivo: 'false' } }, { new: true });

        if (!lugarActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar eliminar el usuario.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Se a ${blnActivo === 'true'? 'activado': 'desactivado'} la persona correctamente.`,
                cont: {
                    lugarActualizado
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al eliminar ael lugar.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});


module.exports = app;