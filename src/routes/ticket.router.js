const express = require('express')
const { Router } = express
const router = new Router()
const { checkLogin } = require('../middlewares/sessions.middleware.js')

const { getTicket, getTicketByIDCart } = require('../controllers/ticket.controller.js')

router.get("/", checkLogin ,getTicket)
router.get("/filter", checkLogin ,getTicketByIDCart)


module.exports = router