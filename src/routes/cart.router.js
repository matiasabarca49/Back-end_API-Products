const express = require('express')
//controllers
const controller = require('../controllers/cart.controller.js')

const { Router } = express
const router = new Router()

//middleware
const { checkPerCart } = require('../middlewares/permissions.middleware.js')

/** 
 *  GET
 **/
router.get("/:cid", checkPerCart,controller.getCartByID )
router.get("/:cid/purchase", checkPerCart,controller.getPurchase)

/** 
 *  POST
 **/
//Agrega un cart a la DB(/api/carts/). Para agregar productos al usuario revise su enpoint(/api/users/addcart)
router.post("/", checkPerCart,controller.addCart)
router.post("/:cid/product/:pid", checkPerCart,controller.addProductInCart)

/** 
 *  PUT
 **/
router.put("/:cid", checkPerCart,controller.updateFullCartInDB)
router.put("/:cid/product/:pid", checkPerCart,controller.updateProductCartInDB)

/** 
 *  DELETE
 **/
router.delete("/:cid/product/:pid", checkPerCart,controller.deleteProductInCart )
router.delete("/:cid", checkPerCart,controller.deleteFullCart)


module.exports = router