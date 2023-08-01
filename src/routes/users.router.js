const express = require('express')
const { Router } = express
const router = new Router()
//controllers
const { addCartToUser } = require('../controllers/users.controller.js')

/**
*   PUT 
**/
router.put( '/addcart', addCartToUser)

module.exports = router