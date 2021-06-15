/*jshint esversion: 9*/
const TiendaModel = require('../../models/tienda.model');
const UsuarioModel = require('../../models/usuario.model');
const CompraModel = require('../../models/compra.model');
const express = require('express');
const app = express();


// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28
app.get('/', async(req, res) => {

    try {

        let idCompra = '';

        const idTienda = req.query.idTienda;

        if (req.query.idCompra)
            idCompra = req.query.idCompra;

        let queryFind = {};

        if (idCompra) {
            queryFind = {
                '_id': idTienda,
                'ajsnCompra._id': idCompra
            };
        } else {
            queryFind = {
                '_id': idTienda
            };
        }

        if (idTienda == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        const tienda = await TiendaModel.find(queryFind);

        if (tienda.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron compras en la base de datos.',
                cont: {
                    tienda
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    tienda
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener las compras.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }


});

// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28
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

        const compra = new CompraModel(req.body);
        let err = compra.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la compra.',
                cont: {
                    err
                }
            });
        }

        const nuevaCompra = await TiendaModel.findByIdAndUpdate(idTienda, { $push: { 'ajsnCompra': compra } }, { new: true });
        const newAnimalito = await UsuarioModel.findByIdAndUpdate(compra.idPersona, { $push: { arrMascotas: compra.idAnimalito } });
        if (nuevaCompra.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar la compra en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    compra
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la compra.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});
// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28&idCompra=603e5d996dcc7c2108734283
app.put('/', async(req, res) => {

    try {

        const idTienda = req.query.idTienda;
        const idCompra = req.query.idCompra;

        if (idTienda == undefined || idCompra == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idCompra;

        const compra = new CompraModel(req.body);
        let err = compra.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al actualizar la compra.',
                cont: {
                    err
                }
            });
        }


        const nuevaCompra = await TiendaModel.findOneAndUpdate({ '_id': idTienda, 'ajsnCompra._id': idCompra }, { $set: { 'ajsnCompra.$.nmbPrecio': compra.nmbPrecio, 'ajsnCompra.$.idPersona': compra.idPersona, 'ajsnCompra.$.idAnimalito': compra.idAnimalito, 'ajsnCompra.$.dteFechaCompra': compra.dteFechaCompra } }, { new: true });

        if (nuevaCompra.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo actualizar la compra en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion actualizada correctamente.',
                cont: {
                    compra
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar la compra.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28&idCompra=603e5d996dcc7c2108734283
app.delete('/', async(req, res) => {

    try {

        const idTienda = req.query.idTienda;
        const idCompra = req.query.idCompra;
        const blnActivo = req.body.blnActivo;

        if (idTienda == undefined || idCompra == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }


        const nuevaCompra = await TiendaModel.findOneAndUpdate({ '_id': idTienda, 'ajsnCompra._id': idCompra }, { $set: { 'ajsnCompra.$.blnActivo': blnActivo } }, { new: true });

        if (nuevaCompra.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo eliminar la compra en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion eliminada correctamente.',
                cont: {
                    nuevaCompra
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar la compra.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

module.exports = app;