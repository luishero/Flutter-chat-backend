/*
    path: api/login

*/
const { Router} = require('express');
const { check } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT} = require('../middlewares/validar-jwt');
// const { check } = require('express-validator');

// const { crearUsuario, login, renewToken } = require('../controllers/auth');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/new',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    validarCampos
], crearUsuario);

router.post('/', [
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
], login );
//post: /
//nueva ruta,peti a /renew, funcion , controlador : renewToken
//, validarJWT
router.get('/renew', validarJWT, renewToken);

// validar email, password

module.exports = router;