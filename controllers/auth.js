const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body; //extraer el email

    try {

        const existeEmail = await Usuario.findOne({ email });
        if( existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encripar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);

        await usuario.save();

        //Generar mi JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            ok: true,
            usuario,
            token
        });   

    }catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }        
}
const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        //verificar el email
        const usuarioDB = await Usuario.findOne({ email });
        if( ! usuarioDB ) {
            return res.status(404).json ({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //Validar el password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(404).json({
                ok: false,
                msg: 'La contraseña no es valida'

            });
        }

        // si llegamos a este punto generamos el JWT
        const token = await generarJWT( usuarioDB.id);

        //respuesta que se manda en un login exitoso
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch ( error) {
    console.log(error);
    return res.status(500).json({
        ok: false,
        msg: 'Hable con el administrador'
    })
}


}

/* const renewToken = async ( req, res = response ) => {

    res.json({
        ok:true,
        msg: 'Renew',
        uid: req.uid
    })
}
 */
const renewToken = async( req, res = response) => {

    // const uid : uid del usuario
    const uid = req.uid;

    // generar un nuevo JWT, generarJWT... uid...
    const token = await generarJWT( uid );

    // Obtener el usuario por el UID, Usuario.findById... 
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    });

}
// const login .... req, res...
// {ok: true, msg: 'login' }

module.exports = {
    crearUsuario,
    login,
    renewToken
}