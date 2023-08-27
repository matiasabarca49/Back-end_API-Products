const express = require('express')
const { Router } = express
const router = new Router()
//controllers
const { addPurchaseToUser, addProductToCartFromUser } = require('../controllers/users.controller.js')

const ath = (req, res, next) =>{
    if(req.session.rol === "User"){
        next()
    }
    else{
        res.send({status: "ERROR", reason: "Solo los usuarios pueden agregar productos al carrito"})
    }
}

/**
*   PUT 
**/
router.post( '/addcart', ath, addProductToCartFromUser)
router.put( '/addpurchase', ath, addPurchaseToUser)

module.exports = router