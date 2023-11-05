const express = require('express')
const { Router } = express
const router = new Router()
//Multer
const uploader = require('../utils/multer.js')
//controllers
const { getUsers,changeRol, addPurchaseToUser, addProductToCartFromUser, addDocumentsInUser, delUser, delUserForConnectionn, delProductFromUser } = require('../controllers/users.controller.js')

const athCart = (req, res, next) =>{
    if(req.session.rol === "User" || req.session.rol === "Premium"){
        next()
    }
    else{
        res.status(401).send({status: "ERROR", reason: "Solo los usuarios normales y los premium pueden agregar productos al carrito"})
    }
}

const athRol = (req, res, next) =>{
    if(req.session.rol === "Admin"){
        next()
    }else{
        res.status(401).send({status: "ERROR", reason: "Solo los administradores pueden administrar a los usuarios"}) 
    }
}

/**
*   GET 
**/
router.get("/", getUsers)

/**
*   POST 
**/
router.post( '/addcart', athCart, addProductToCartFromUser)
router.post( '/:uid/documents',uploader.single('file'),addDocumentsInUser)
    
/**
*   PUT 
**/
router.put('/premium/:uid', athRol, changeRol)

/**
*   DELETE
**/
router.delete("/:id", athRol, delUser)
router.delete("/delete/withoutconnection", athRol, delUserForConnectionn)
router.delete("/delete/product/:id", delProductFromUser)

module.exports = router