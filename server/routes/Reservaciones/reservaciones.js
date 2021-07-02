/*jshint esversion: 9*/
const ReservacionesModel = require('../../models/reservaciones.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const reservacionesModel = require('../../models/reservaciones.model');
const app = express();


// http://localhost:3000/api/reservaciones/
app.get('/', async(req, res) => {
    try {

        const reservacion = await ReservacionesModel.find();
        if (reservacion.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron reservaciones en la base de datos.',
                cont: {
                    reservacion
                } 
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    reservacion
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a las reservaciones',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/reservaciones/
app.post('/', async(req, res) => {

    try {
        const lug = new ReservacionesModel(req.body);

        let err = lug.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la reservacion.',
                cont: {
                    err
                }
            });
        }

        const reservacionEncontrada = await ReservacionesModel.findOne({ idLugar: { $regex: `^${lug.idLugar}$`, $options: 'i' } });
        if (reservacionEncontrada) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'El lugar que desea registrar ya se encuentra en uso.',
            cont: {
                lugar: reservacionEncontrada.idLugar
            }
        });

        const reserva = await lug.save();
        if (reserva.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar la reservacion en la base de datos.',
                cont: {
                    reserva
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    reserva
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la reservacion.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/reservacion/?idReservacion=603939becf1db633f87595b2
app.put('/', async(req, res) => {
    try {

        const idReservacion = req.query.idReservacion;

        if (idReservacion == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idReservacion;

        const ReservacionEncontrada = await ReservacionesModel.findById(idReservacion);

        if (!ReservacionEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el reservacion en la base de datos.',
                cont: ReservacionEncontrada
            });

        const newReservacion = new ReservacionesModel(req.body);

        let err = newReservacion.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la reservacion.',
                cont: {
                    err
                }
            });
        }

        const ReservacionActualizada = await reservacionesModel.findByIdAndUpdate(idReservacion, { $set: newReservacion }, { new: true });

        if (!ReservacionActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar la reservacion.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo la reservacion correctamente.',
                cont: {
                    ReservacionActualizada
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar la reservacion.',
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