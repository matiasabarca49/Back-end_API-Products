const CartManager = require('../dao/mongo/cart.mongo')
const cartManager = new CartManager()

const getCartByID = async (req,res)=>{
    const cart = await cartManager.getCart(req.params.cid)
    if (cart){
        res.status(200).send({status:"Success", cart: cart})
    } else{
        res.status(404).send({status:"Error", reason: "No existe carrito con ese id o problemas con DB"})
    }
}

const addCart = async (req, res) =>{
    const cartAdded = await cartManager.postCart(req.body)
    cartAdded
     ?res.status(201).send({status: "Success", reason: "Cart agregado a DB", cart: cartAdded})
     :res.status(400).send({status: "Error", reason: "Campos erroneos o los datos no fueron validados"})
 }

const addProductInCart = async (req,res) => {
    const productAdded = await cartManager.postProductInCart(req.params.cid, req.params.pid)
    productAdded
        ?res.status(201).send({status: "Success", product: productAdded})
        :res.status(404).send({status: "Error", reason: "El carrito no existe"})
}

const getPurchase = async (req, res) =>{
    const idCart = req.params.cid
    const idUser = req.session.passport.user
    const purchaseState = await cartManager.getPurchase(idCart, idUser )
    req.session.purchases = purchaseState.purchases
    req.session.cart = purchaseState.cart
    purchaseState.purchase
        ? res.status(201).send({status: "Success", cart: purchaseState.purchase, ticket: purchaseState.ticket})
        : res.status(500).send({status: "Error"})
}

const updateFullCartInDB = async (req, res) => {
    const newCart = req.body
    const cartUpdated = await cartManager.putFullCartInDB(req.params.cid, newCart)
    cartUpdated
        ?res.status(200).send( {status: "Success", cartUpdated: cartUpdated})
        :res.status(404).send({ status: "Error", reason: "El carrito no existe" })
}

const updateProductCartInDB = async (req,res) => {
    const productAdded = await cartManager.putProductCartInDB(req.params.cid, req.params.pid, req.body.quantity)
    productAdded
        ?res.status(200).send({status: "Success", product: productAdded})
        :res.status(404).send({status: "Error", reason: "El carrito no existe o el producto no existe"})
}

const deleteProductInCart = async (req, res) =>{
    const { cid, pid } = req.params
    const cartUpdated = await cartManager.delProductInCart(cid, pid )
    cartUpdated
        ?res.status(200).send({status: "Success", cartUpdated: cartUpdated})
        :res.status(500).send({status: "Error", reason: "El carrito no existe o el producto no existe"})
}

const deleteFullCart = async (req, res) =>{
    const { cid } = req.params
    const cartUpdated = await cartManager.delFullCart(cid)
    cartUpdated
        ?res.status(201).send({status: "Success", cartUpdated: cartUpdated})
        :res.status(500).send({status: "Error", reason: "El carrito no existe"})
}

module.exports = {
    getCartByID,
    addCart,
    addProductInCart,
    getPurchase,
    updateFullCartInDB,
    updateProductCartInDB,
    deleteProductInCart,
    deleteFullCart
}



