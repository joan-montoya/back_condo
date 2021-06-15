/*jshint esversion: 9*/
const MascotaModel = require('../../models/mascota.model');
const TiendaModel = require('../../models/tienda.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();

// http://localhost:3000/api/mascota/
app.get('/', async(req, res) => {
    try {
        if (req.query.idMascota) req.queryMatch._id = req.query.idMascota;
        if (req.query.termino) req.queryMatch.$or = Helper(["strNombre"], req.query.termino);

        const mascota = await MascotaModel.find({...req.queryMatch });

        if (mascota.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron mascotas en la base de datos.',
                cont: {
                    mascota
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    mascota
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener las mascotas.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/mascota/
app.post('/', async(req, res) => {
    try {

        const idTienda = req.query.idTienda;
         if (idTienda == undefined) {
             return res.status(400).send({
                 estatus: '400',
                 err: true,
                 msg: 'Error: No se envio un id valido.',
                 cont: 0
             });
         }
        const mascota = new MascotaModel(req.body);

        let err = mascota.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la mascota.',
                cont: {
                    err
                }
            });
        }

        const nuevaMascota = await mascota.save();
        if (nuevaMascota.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se pudo registrar la mascota en la base de datos.',
                cont: {
                    nuevaMascota
                }
            });

        } else {
            const newAnimalito = await TiendaModel.findByIdAndUpdate(idTienda, { $push: { arrAnimalitosDisponibles: nuevaMascota } });
             if (newAnimalito.length <= 0) {
                 res.status(400).send({
                     estatus: '400',
                     err: true,
                     msg: 'Error: No se pudo insertar la el animalito en el array de animalitos.',
                     cont: {
                         newAnimalito
                   }
                 });
             } else {
                res.status(200).send({
                    estatus: '200',
                    err: false,
                    msg: 'Success: Informacion insertada correctamente.',
                    cont: {
                        nuevaMascota
                    }
                });
            }
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al registrar la mascota.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});


// http://localhost:3000/api/mascota/?idMascota=6035203dca507a1f54577bb7
app.put('/', async(req, res) => {
    try {

        const idAnimalito = req.query.idMascota;

        if (req.query.idMascota == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idAnimalito;

        const mascotaEncontrada = await MascotaModel.findById(idAnimalito);

        if (!mascotaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la mascota en la base de datos.',
                cont: mascotaEncontrada
            });

        const newAnimalito = new MascotaModel(req.body);

        let err = newAnimalito.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la mascota.',
                cont: {
                    err
                }
            });
        }

        const animalitoActualizado = await MascotaModel.findByIdAndUpdate(idAnimalito, { $set: newAnimalito }, { new: true });

        if (!animalitoActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar el animalito.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo el animalito correctamente.',
                cont: {
                    animalitoActualizado
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar la mascota.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/mascota/?idMascota=6035203dca507a1f54577bb7
app.delete('/', async(req, res) => {

    try {

        if (req.query.idMascota == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        idAnimalito = req.query.idMascota;
        blnActivo = req.body.blnActivo;

        const mascotaEncontrada = await MascotaModel.findById(idAnimalito);

        if (!mascotaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la mascota en la base de datos.',
                cont: mascotaEncontrada
            });

        const animalitoActualizado = await MascotaModel.findByIdAndUpdate(idAnimalito, { $set: { blnActivo } }, { new: true });

        if (!animalitoActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar eliminar el animalito.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Se a ${blnActivo === 'true'? 'activado': 'eliminado'} el animalito correctamente.`,
                cont: {
                    animalitoActualizado
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al eliminar la mascota.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

module.exports = app;