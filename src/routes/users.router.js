const express = require('express')
const { Router } = express
const router = new Router()
//Multer
const uploader = require('../utils/multer.js')
//controllers
const { getUsers, getUserByFilter, changeRol, addPurchaseToUser, addProductToCartFromUser, addDocumentsInUser, delUser, delUserForConnectionn, delProductFromUser, createUser } = require('../controllers/users.controller.js')
//middleware
const {checkPerAdmCart, CheckPerRol, checkPermAdmin} = require('../middlewares/permissions.middleware.js')


/**
*   GET 
**/
router.get("/",checkPermAdmin ,getUsers)
router.get("/filter", checkPermAdmin, getUserByFilter)

/**
*   POST 
**/
router.post('/', createUser)
router.post( '/addcart', checkPerAdmCart, addProductToCartFromUser)
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