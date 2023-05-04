const express = require('express')
const CartManager = require('../CartManager')


const { Router } = express

const router = new Router()

const cartManager = new CartManager('./data/carts.json')

/** 
 *  GET
 **/

router.get("/:cid", (req,res)=>{
    const cart = cartManager.getCart(req.params.cid)
    res.send({status:"Success", cart: cart})
})

/** 
 *  POST
 **/

router.post("/", (req, res) =>{
    cartManager.addCart(req.body)
    res.send({status: "Carrito Creado", producto: req.body})
})

router.post("/:cid/product/:pid", (req,res) => {
    cartManager.addProductToCart(req.params.cid, req.params.pid)
    res.send({status: "success"})
})


module.exports = router