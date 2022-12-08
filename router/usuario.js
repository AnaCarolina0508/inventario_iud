const { Router } = require('express');
const { validationResult, check } = require('express-validator');

const Usuario = require('../models/Usuario');
const { validarUsuario } = require('../helpers/validar-usuario');
const bycript = require('bcryptjs');

const router = Router();

router.post('/', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
    check('contrasena', 'invalid.contrasena').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),

    ], async function (req, res) {

    try {
        const validaciones = validarUsuario(req);

        if (validaciones.length > 0) {
            return res.status(400).send(validaciones);
        }

        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeEmail = await Usuario.findOne({ email: req.body.email });
        console.log(existeEmail);
        if (existeEmail) {
            return res.status(400).json({ mensaje: 'email ya existe' });
        }

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;

        const salt = bycript.genSaltSync();
        const contrasena = bycript.hashSync(req.body.contrasena,salt);
        usuario.contrasena = contrasena;

        usuario.rol = req.body.rol;
        usuario.estado = req.body.estado;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();

        res.send(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Internal server error' });
    }
});
router.get('/', async function (req, res) {
    try {
        const usuarios = await Usuario.find(); //find= select * from usuario
        res.send(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje: 'Internal server error'});
    }
});
router.put('/:usuarioId', async function (req, res) {
    try {
        console.log(req.body, req.params);

        let usuario = await Usuario.findById(req.params.usuarioId);

        if (!usuario) {
            return res.status(400).json({mensaje: 'Usuario no existe'});
        }

        const existeUsuario = await Usuario
            .findOne({ email: req.body.email, _id: { $ne: usuario._id } });
        console.log(existeUsuario);
        if (existeUsuario) {
            return res.status(400).json({mensaje: 'Email ya existe'});
        }

        usuario.email = req.body.email;
        usuario.nombre = req.body.nombre;
        usuario.estado = req.body.estado;
        usuario.fechaActualizacion = new Date();


        usuario = await usuario.save();

        res.send(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje: 'Ocurrio un error'});
    }
});

module.exports = router;