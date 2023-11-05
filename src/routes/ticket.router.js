const express = require('express')
const { Router } = express
const router = new Router()
const { checkLogin } = require('../utils/utils.js')

const { getTicket } = require('../controllers/ticket.controller.js')

router.get("/", checkLogin ,getTicket)


module.exports = router