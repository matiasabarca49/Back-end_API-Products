const express = require('express')
const { Router } = express
//controllers
const { getChat } = require('../controllers/chat.controller')

const router = new Router()

/**
* GET
*/
router.get("/", getChat)

module.exports = router