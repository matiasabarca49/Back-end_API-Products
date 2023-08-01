const express = require('express')
//controllers
const controller = require('../controllers/cart.controllers.js')

const { Router } = express
const router = new Router()

/** 
 *  GET
 **/
router.get("/:cid", controller.getCartByID )

/** 
 *  POST
 **/
router.post("/", controller.addCart)
router.post("/:cid/product/:pid", controller.addProductInCart)

/** 
 *  PUT
 **/
router.put("/:cid", controller.updateFullCartInDB)
router.put("/:cid/product/:pid", controller.updateProductCartInDB)

/** 
 *  DELETE
 **/
router.delete("/:cid/product/:pid", controller.deleteProductInCart )
router.delete("/:cid", controller.deleteFullCart)


module.exports = router