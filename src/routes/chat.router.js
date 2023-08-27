const express = require('express')
const { Router } = express
//controllers
const { getChatPage } = require('../controllers/chat.controller')

const router = new Router()

const ath = ( req, res, next )=> {
    if (req.session.rol === "Admin"){
        res.send("Los administradores no pueden acceder al chat")
    }
    else{
        next()
    }
}

/**
* GET
*/
router.get("/", ath,getChatPage)

module.exports = router