const { Router} = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middleware/validate-jwt');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { fieldsValidator } = require('../middleware/fields-validator');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas tienen que pasar por la validación del JWT
router.use( validateJWT );

// Obtener eventos
router.get('/', getEvents);

// Crear Evento
router.post(
    '/', 
    [ 
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom( isDate ),
        check('end', 'Fecha de finalización es obligatorio').custom( isDate ),
        fieldsValidator
    ],
    createEvent
);

// Actualizar Evento
router.put(
    '/:id', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom( isDate ),
        check('end', 'Fecha de finalización es obligatorio').custom( isDate ),
        fieldsValidator
    ],
    updateEvent
);

// Eliminar Evento
router.delete('/:id', deleteEvent);

module.exports = router;