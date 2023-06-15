const express = require('express')
const ServiceMongo = require('../dao/dbService.js')
const Cart = require('../dao/models/cartsModels.js')


const { Router } = express

const router = new Router()

const serviceMongo = new ServiceMongo()

/** 
 *  GET
 **/

router.get("/:cid", async (req,res)=>{
    const cart = await serviceMongo.getDocumentsByID(Cart ,req.params.cid)
    if (cart){
        res.send({status:"Success", cart: cart})
    } else{
        res.send({status:"Error", reason: "No existe carrito con ese id o problemas con DB"})

    }
})

/** 
 *  POST
 **/

router.post("/", async (req, res) =>{
   const cartAdded = await serviceMongo.createNewDocument(Cart, req.body)
   cartAdded
    ?res.status(201).send({status: "Success", reason: "Cart agregado a DB",producto: cartAdded})
    :res.status(500).send({status: "Error", reason: "Campos erroneos o problemas con DB o los datos no fueron validados"})
})

router.post("/:cid/product/:pid", async (req,res) => {
    const productAdded = await serviceMongo.addProductToCartInDB(Cart, req.params.cid, req.params.pid)
    productAdded
        ?res.status(201).send({status: "Success", product: productAdded})
        :res.status(500).send({status: "Error", reason: "El carrito no existe"})
})

/** 
 *  PUT
 **/

router.put("/:cid", async (req, res) => {
    const newCart = req.body
    const cartUpdated = await serviceMongo.updateCartInDB(Cart, req.params.cid, newCart)
    cartUpdated
        ?res.status(201).send( {status: "Success", cartUpdated: cartUpdated})
        :res.status(500).send({ status: "Error", reason: "El carrito no existe" })
})

router.put("/:cid/product/:pid", async (req,res) => {
    console.log(req.body.quantity)
    const productAdded = await serviceMongo.addProductToCartInDB(Cart, req.params.cid, req.params.pid, req.body.quantity)
    productAdded
        ?res.status(201).send({status: "Success", product: productAdded})
        :res.status(500).send({status: "Error", reason: "El carrito no existe"})
})


/** 
 *  DELETE
 **/


module.exports = router