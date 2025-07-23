const express = require('express')
const { Router } = express
const router = new Router()
const { checkLogin } = require('../middlewares/sessions.middleware.js')

const { getTicket } = require('../controllers/ticket.controller.js')

router.get("/", checkLogin ,getTicket)


module.exports = router