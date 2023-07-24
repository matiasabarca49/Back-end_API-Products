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
        res.status(200).send({status:"Success", cart: cart})
    } else{
        res.status(404).send({status:"Error", reason: "No existe carrito con ese id o problemas con DB"})

    }
})

/** 
 *  POST
 **/

router.post("/", async (req, res) =>{
   const cartAdded = await serviceMongo.createNewDocument(Cart, req.body)
   cartAdded
    ?res.status(201).send({status: "Success", reason: "Cart agregado a DB", cart: cartAdded})
    :res.status(400).send({status: "Error", reason: "Campos erroneos o los datos no fueron validados"})
})

router.post("/:cid/product/:pid", async (req,res) => {
    const productAdded = await serviceMongo.addProductToCartInDB(Cart, req.params.cid, req.params.pid)
    productAdded
        ?res.status(201).send({status: "Success", product: productAdded})
        :res.status(404).send({status: "Error", reason: "El carrito no existe"})
})

/** 
 *  PUT
 **/

router.put("/:cid", async (req, res) => {
    const newCart = req.body
    const cartUpdated = await serviceMongo.updateCartInDB(Cart, req.params.cid, newCart)
    cartUpdated
        ?res.status(200).send( {status: "Success", cartUpdated: cartUpdated})
        :res.status(404).send({ status: "Error", reason: "El carrito no existe" })
})

router.put("/:cid/product/:pid", async (req,res) => {
    console.log(req.body.quantity)
    const productAdded = await serviceMongo.addProductToCartInDB(Cart, req.params.cid, req.params.pid, req.body.quantity)
    productAdded
        ?res.status(201).send({status: "Success", product: productAdded})
        :res.status(404).send({status: "Error", reason: "El carrito no existe"})
})


/** 
 *  DELETE
 **/

router.delete("/:cid/product/:pid", async (req, res) =>{
    const { cid, pid } = req.params
    const cartUpdated = await serviceMongo.deleteProductCartInDB( Cart, cid, pid )
    cartUpdated
        ?res.status(201).send({status: "Success", cartUpdated: cartUpdated})
        :res.status(500).send({status: "Error", reason: "El carrito no existe o el producto no existe"})
} )

router.delete("/:cid", async (req, res) =>{
    const { cid } = req.params
    const cartUpdated = await serviceMongo.deleteFullCartInDB(Cart, cid)
    cartUpdated
        ?res.status(201).send({status: "Success", cartUpdated: cartUpdated})
        :res.status(500).send({status: "Error", reason: "El carrito no existe"})

})


module.exports = router