const express = require('express')
const { Router } = express
const router = new Router()
//Multer
const uploader = require('../utils/multer.js')
//controllers
const { getUsers,changeRol, addPurchaseToUser, addProductToCartFromUser, addDocumentsInUser, delUser, delUserForConnectionn, delProductFromUser } = require('../controllers/users.controller.js')
//middleware
const {checkPerAddCart, CheckPerRol} = require('../middlewares/permissions.middleware.js')


/**
*   GET 
**/
router.get("/", getUsers)

/**
*   POST 
**/
router.post( '/addcart', checkPerAddCart, addProductToCartFromUser)
router.post( '/:uid/documents',uploader.single('file'),addDocumentsInUser)
    
/**
*   PUT 
**/
router.put('/premium/:uid', CheckPerRol, changeRol)

/**
*   DELETE
**/
router.delete("/:id", CheckPerRol, delUser)
router.delete("/delete/withoutconnection", CheckPerRol, delUserForConnectionn)
router.delete("/delete/product/:id", delProductFromUser)

module.exports = router