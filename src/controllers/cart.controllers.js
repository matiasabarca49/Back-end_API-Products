const ServiceMongo = require('../service/dbService.js')
const serviceMongo = new ServiceMongo()
const Cart = require('../dao/models/cartsModels.js')

const getCartByID = async (req,res)=>{
    const cart = await serviceMongo.getDocumentsByID(Cart ,req.params.cid)
    if (cart){
        res.status(200).send({status:"Success", cart: cart})
    } else{
        res.status(404).send({status:"Error", reason: "No existe carrito con ese id o problemas con DB"})
    }
}

const addCart = async (req, res) =>{
    const cartAdded = await serviceMongo.createNewDocument(Cart, req.body)
    cartAdded
     ?res.status(201).send({status: "Success", reason: "Cart agregado a DB", cart: cartAdded})
     :res.status(400).send({status: "Error", reason: "Campos erroneos o los datos no fueron validados"})
 }

const addProductInCart = async (req,res) => {
    const productAdded = await serviceMongo.addProductToCartInDB(Cart, req.params.cid, req.params.pid)
    productAdded
        ?res.status(201).send({status: "Success", product: productAdded})
        :res.status(404).send({status: "Error", reason: "El carrito no existe"})
}

const updateFullCartInDB = async (req, res) => {
    const newCart = req.body
    const cartUpdated = await serviceMongo.updateCartInDB(Cart, req.params.cid, newCart)
    cartUpdated
        ?res.status(200).send( {status: "Success", cartUpdated: cartUpdated})
        :res.status(404).send({ status: "Error", reason: "El carrito no existe" })
}

const updateProductCartInDB = async (req,res) => {
    console.log(req.body.quantity)
    const productAdded = await serviceMongo.addProductToCartInDB(Cart, req.params.cid, req.params.pid, req.body.quantity)
    productAdded
        ?res.status(201).send({status: "Success", product: productAdded})
        :res.status(404).send({status: "Error", reason: "El carrito no existe o el producto no existe"})
}

const deleteProductInCart = async (req, res) =>{
    const { cid, pid } = req.params
    const cartUpdated = await serviceMongo.deleteProductCartInDB( Cart, cid, pid )
    cartUpdated
        ?res.status(201).send({status: "Success", cartUpdated: cartUpdated})
        :res.status(500).send({status: "Error", reason: "El carrito no existe o el producto no existe"})
}

const deleteFullCart = async (req, res) =>{
    const { cid } = req.params
    const cartUpdated = await serviceMongo.deleteFullCartInDB(Cart, cid)
    cartUpdated
        ?res.status(201).send({status: "Success", cartUpdated: cartUpdated})
        :res.status(500).send({status: "Error", reason: "El carrito no existe"})
}

module.exports = {
    getCartByID,
    addCart,
    addProductInCart,
    updateFullCartInDB,
    updateProductCartInDB,
    deleteProductInCart,
    deleteFullCart
}



