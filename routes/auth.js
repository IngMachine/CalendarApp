/* 
    Rutas de usuarios / auth
    host + /api/auth
*/

const { Router} = require('express');
const router = Router();

const { check } = require('express-validator');

const { fieldsValidator } = require('../middleware/fields-validator');
const { createUser, login, renewToken } = require('../controllers/auth');
const { validateJWT } = require('../middleware/validate-jwt');

router.post(
    '/new',
    [
        // middleware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('name', 'El nombre debe ser mayor a 4 caracteres').isLength({ min: 5 }),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser mayor a 6 caracteres').isLength({ min: 6 }),
        fieldsValidator
    ],
    createUser
);

router.post(
    '/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser mayor a 6 caracteres').isLength({ min: 6 }),
        fieldsValidator
    ],
    login
);

router.get(
    '/renew', 
    validateJWT,
    renewToken
);

module.exports = router;