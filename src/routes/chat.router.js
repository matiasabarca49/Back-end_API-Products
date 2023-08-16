const express = require('express')
const { Router } = express
//controllers
const { getChatPage } = require('../controllers/chat.controller')

const router = new Router()

/**
* GET
*/
router.get("/", getChatPage)

module.exports = router