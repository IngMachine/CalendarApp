const { response } = require('express')
const Event = require('../models/Event')

const getEvents = async(req, res = response) => {
    const events = await Event.find()
                              .populate('user', 'name');
    res.json({
        ok: true,
        events
    })
}

const createEvent = async (req, res = response) => {
    const event = new Event( req.body );

    try {
        event.user = req.uid;
        const eventSaved = await event.save();

        res.json({
            ok: true,
            event: eventSaved
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    res.json({
        ok: true,
        msg: 'createEvent'
    })
}

const updateEvent = async(req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById( eventId );
        if( !event ){
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            })
        }

        if( event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privigelio de editar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } )

        res.json({
            ok: true,
            event: eventUpdated
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const deleteEvent = async(req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById( eventId );
        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            })
        }

        if( event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privigelio de eliminar este evento'
            })
        }
        
        await Event.findByIdAndDelete( eventId )

        res.json({
            ok: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}