const jwt = require ('jsonwebtoken');

const validarRolAdministrador = (req, res, next) => {
    if(req.payload.rol !== 'Administrador'){
        return res.status(401).json({ mensaje: 'Error, no está autorizado'});

    }
    next();
}

module.exports = {
    validarRolAdministrador
}