/*jshint esversion: 9*/
const CuentasModel = require('../../models/cuentas.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/usuario/
app.get('/', async(req, res) => {
    try {
        if (req.query.idPersona) req.queryMatch._id = req.query.idPersona;
        if (req.query.termino) req.queryMatch.$or = Helper(["strNombre", "strCorreo"], req.query.termino);

        const cuenta = await CuentasModel.aggregate([   
            {
                $lookup: {
                    from: 'condominos', //Nombre de la tabla
                    localField: 'idPersona', //En que campo lo tengo
                    foreignField: '_id',
                    as: 'Usuario'
                }
            },
            {
                $project: {
                    'id': 1,
                    '_id':'$_id',
                    'idPersona':'$idPersona',
                    'Persona': {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: '$Usuario',
                                    as: 'usuario',
                                    cond: {
                                        $eq: ['$idPersona', '$$usuario._id']
                                    }
                                }
                            }, 0
                        ]

                    },
                    'blnActivo':'$blnActivo',
                    'strNumTarjeta':'$strNumTarjeta',
                    'strCvv':'$strCvv',
                    'strPin':'$strPin',
                    'nmbSaldo':"$nmbSaldo",
                    'created_at':1,
                    'updated_at':1,
                }
            }
            
        ])
        if (cuenta.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron cuentas en la base de datos.',
                cont: {
                    cuenta
                } 
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    cuenta
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener las cuentas.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/usuario/
app.post('/', async(req, res) => {

    try {
        const cuenta = new CuentasModel(req.body);

        let err = cuenta.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la cuenta.',
                cont: {
                    err
                }
            });
        }

        const CuentaEncontrada = await CuentasModel.findOne({ strNumTarjeta: { $regex: `^${cuenta.strNumTarjeta}$`, $options: 'i' } });

        if (CuentaEncontrada) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'El numero de cuenta que desea registrar ya se encuentra en uso.',
            cont: {
                Correo: CuentaEncontrada.strNumTarjeta
            }
        });

        const Cuenta = await cuenta.save();
        if (Cuenta.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar la cuenta en la base de datos.',
                cont: {
                    Cuenta
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    Cuenta
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la cuenta.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/usuario/?idPersona=603939becf1db633f87595b2
app.put('/', async(req, res) => {
    try {

        const idCuenta = req.query.idCuenta;

        if (idCuenta == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idCuenta;

        const cuentaEncontrada = await CuentasModel.findById(idCuenta);

        if (!cuentaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la cuenta en la base de datos.',
                cont: cuentaEncontrada
            });

        const newCuenta = new CuentasModel(req.body);

        let err = newCuenta.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la cuenta.',
                cont: {
                    err
                }
            });
        }

        const cuentaActualizada = await CuentasModel.findByIdAndUpdate(idCuenta, { $set: newCuenta }, { new: true });

        if (!cuentaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar la cuenta.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo la cuenta correctamente.',
                cont: {
                    cuentaActualizada
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar la cuenta.',
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