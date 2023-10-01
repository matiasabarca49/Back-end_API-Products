const express = require('express')
//controllers
const controller = require('../controllers/cart.controller.js')

const { Router } = express
const router = new Router()

const ath = (req, res, next)=>{
    if(req.session.rol === "User" || req.session.rol === "Premium"){
        next()
    }
    else if(req.session.rol === "Admin"){
        /* res.send({status: "ERROR", reason: "Solo los usuarios pueden agregar productos al carrito" }) */
        res.send("Solo los usuarios normales y los premium pueden agregar productos al carrito")
    }
    else{
        /* res.send({status: "ERROR", reason: "No está logueado" }) */
        res.redirect("/api/sessions/login")
    }
}

/** 
 *  GET
 **/
router.get("/:cid", ath,controller.getCartByID )
router.get("/:cid/purchase", ath,controller.getPurchase)

/** 
 *  POST
 **/
//Agrega un cart a la DB(/api/carts/). Para agregar productos al usuario revise su enpoint(/api/users/addcart)
router.post("/", ath,controller.addCart)
router.post("/:cid/product/:pid", ath,controller.addProductInCart)

/** 
 *  PUT
 **/
router.put("/:cid", ath,controller.updateFullCartInDB)
router.put("/:cid/product/:pid", ath,controller.updateProductCartInDB)

/** 
 *  DELETE
 **/
router.delete("/:cid/product/:pid", ath,controller.deleteProductInCart )
router.delete("/:cid", ath,controller.deleteFullCart)


module.exports = router