/*jshint esversion: 9*/
const tiendaModel = require('../../models/tienda.model');
const compraModel = require('../../models/compra.model');
const inventarioModel = require('../../models/inventario.model');
const express = require('express');
const app = express();


// http://localhost:3000/api/inventario/
app.get('/', async(req, res) => {

    try {

        let idInventario = '';

        const idTienda = req.query.idTienda;

        if (req.query.idInventario)
            idInventario = req.query.idInventario;

        let queryFind = {};

        if (idInventario) {
            queryFind = {
                '_id': idTienda,
                'ajsnInventario._id': idInventario
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

        const tienda = await tiendaModel.find(queryFind);

        if (tienda.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron inventarios en la base de datos.',
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
            msg: 'Error al obtener los inventarios.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }


});

// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28
app.post('/', async(req, res) => {
console.log(req.body);
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

        const inventario = new inventarioModel(req.body);
        let err = inventario.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el inventario.',
                cont: {
                    err
                }
            });
        }

        const nuevoInventario = await tiendaModel.findByIdAndUpdate({ "_id": idTienda }, { $push: { "ajsnInventario": inventario } }, { new: true });

        if (nuevoInventario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el inventario en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    nuevoInventario
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar el inventario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.put('/', async(req, res) => {

    try {

        const idTienda = req.query.idTienda;
        const idInventario = req.query.idInventario;

        if (idTienda == undefined || idInventario == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idInventario;

        const inventario = new inventarioModel(req.body);
        let err = inventario.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al actualizar el inventario.',
                cont: {
                    err
                }
            });
        }


        const nuevoInventario = await tiendaModel.findOneAndUpdate({ '_id': idTienda, 'ajsnInventario._id': idInventario }, { $set: { 'ajsnInventario.$.nmbCantidad': inventario.nmbCantidad, 'ajsnInventario.$.idAnimalito': inventario.idAnimalito, 'ajsnInventario.$.strCategoria': inventario.strCategoria} }, { new: true });

        if (nuevoInventario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo actualizar el inventario en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion actualizada correctamente.',
                cont: {
                    inventario
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar el inventario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});


app.delete('/', async(req, res) => {

    try {

        const idTienda = req.query.idTienda;
        const idInventario = req.query.idInventario;
        const blnActivo = req.body.blnActivo;

        if (idTienda == undefined || idInventario == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }


        const nuevoInventario = await tiendaModel.findOneAndUpdate({ '_id': idTienda, 'ajsnInventario._id': idInventario }, { $set: { 'ajsnInventario.$.blnActivo': blnActivo } }, { new: true });

        if (nuevoInventario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo eliminar el inventario en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion eliminada correctamente.',
                cont: {
                    nuevoInventario
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar el inventario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

module.exports = app;