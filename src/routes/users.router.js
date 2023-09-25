const express = require('express')
const { Router } = express
const router = new Router()
//controllers
const { changeRol, addPurchaseToUser, addProductToCartFromUser } = require('../controllers/users.controller.js')

const athCart = (req, res, next) =>{
    if(req.session.rol === "User" || req.session.rol === "Premium"){
        next()
    }
    else{
        res.send({status: "ERROR", reason: "Solo los usuarios normales y los premium pueden agregar productos al carrito"})
    }
}

const athRol = (req, res, next) =>{
    if(req.session.rol === "Admin"){
        next()
    }else{
        res.send({status: "ERROR", reason: "Solo los administradores pueden cambiar de rol a los usuarios"}) 
    }
}

/**
*   POST 
**/
router.post( '/addcart', athCart, addProductToCartFromUser)
    

/**
*   PUT 
**/
router.put('/premium/:uid', athRol, changeRol)
router.put( '/addpurchase', athCart, addPurchaseToUser)

module.exports = router