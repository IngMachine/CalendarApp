const { response } = require('express')
const bcrypt = require('bcryptjs')

const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response ) => {
    const { email, password } = req.body;
    try {
        let user = await  User.findOne({ email });

        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        user = new User( req.body )

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
        await user.save();

        // Generar nuestro jwt
        const token = await generateJWT( user.id, user.name );
        
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const login = async (req, res = response) => {
    const {email, password} = req.body;

    try {
        const user = await  User.findOne({ email });

        if( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // confirmar los password
        const validPassword = bcrypt.compareSync( password, user.password );

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta'
            })
        }

        // Generar nuestro jwt
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const renewToken = async(req, res = response) => {
    const uid = req.uid;
    const name = req.name;
    
    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        token,
        name,
        uid
    })
}

module.exports = {
    createUser,
    login,
    renewToken
}