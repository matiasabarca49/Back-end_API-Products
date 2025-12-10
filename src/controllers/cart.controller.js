const CartService = require('../service/mongo/cart.service')
const cartService = new CartService()

const getCartByID = async (req,res)=>{
    try{
        const cart = await cartService.getById(req.params.cid)
        if (cart){
            res.status(200).send({status:"Success", cart: cart})
        } else{
            res.status(404).send({status:"Error", reason: "No existe carrito con ese id o problemas con DB"})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({status:"Error", reason: "Error del servidor, intente mas tarde"})
    }
}

const addCart = async (req, res) =>{
    try{
        const cartAdded = await cartService.create(req.body)
        cartAdded
         ?res.status(201).send({status: "Success", reason: "Cart agregado a DB", cart: cartAdded})
         :res.status(400).send({status: "Error", reason: "Campos erroneos o los datos no fueron validados"})
     }
     catch(err){
         console.log(err)
         res.status(500).send({status: "Error", reason: "Error del servidor, intente mas tarde"})
     }
}

const addProductInCart = async (req,res) => {
    try{
        const productAdded = await cartService.postProductInCart(req.params.cid, req.params.pid)
        productAdded
            ?res.status(201).send({status: "Success", product: productAdded})
            :res.status(404).send({status: "Error", reason: "El carrito no existe"})
    }catch(err){
        console.log(err)
        res.status(500).send({status: "Error", reason: "Error del servidor, intente mas tarde"})
    }
}

const getPurchase = async (req, res) =>{
    try{
        const idCart = req.params.cid
        const idUser = req.session.passport.user
        const purchaseState = await cartService.getPurchase(idCart, idUser )
        req.session.purchases = purchaseState.purchases
        req.session.cart = purchaseState.cart
        purchaseState.purchase
            ? res.status(201).send({status: "Success", cart: purchaseState.purchase, ticket: purchaseState.ticket})
            : res.status(500).send({status: "Error"})
    }
    catch(err){
        console.log(err)
        res.status(500).send({status: "Error", reason: "Error del servidor, intente mas tarde"})
    }
}

const updateFullCartInDB = async (req, res) => {
    try{
        const newCart = req.body
        const cartUpdated = await cartService.putFullCartInDB(req.params.cid, newCart)
        cartUpdated
            ?res.status(200).send( {status: "Success", cartUpdated: cartUpdated})
            :res.status(404).send({ status: "Error", reason: "El carrito no existe" })
    }catch(err){
        console.log(err)
        res.status(500).send({status: "Error", reason: "Error del servidor, intente mas tarde"})
    }
}

const updateProductCartInDB = async (req,res) => {
    try{
        const productAdded = await cartService.putProductCartInDB(req.params.cid, req.params.pid, req.body.quantity)
        productAdded
            ?res.status(200).send({status: "Success", product: productAdded})
            :res.status(404).send({status: "Error", reason: "El carrito no existe o el producto no existe"})
    }catch(err){
        console.log(err)
        res.status(500).send({status: "Error", reason: "Error del servidor, intente mas tarde"})
    }
}

const deleteProductInCart = async (req, res) =>{
    try{
        const { cid, pid } = req.params
        const cartUpdated = await cartService.delProductInCart(cid, pid )
        cartUpdated
            ?res.status(200).send({status: "Success", cartUpdated: cartUpdated})
            :res.status(500).send({status: "Error", reason: "El carrito no existe o el producto no existe"})
    }
    catch(err){
        console.log(err)
        res.status(500).send({status: "Error", reason: "Error del servidor, intente mas tarde"})
    }
}

const deleteFullCart = async (req, res) =>{
    try{
        const { cid } = req.params
        const cartUpdated = await cartService.delFullCart(cid)
        cartUpdated
            ?res.status(201).send({status: "Success", cartUpdated: cartUpdated})
            :res.status(500).send({status: "Error", reason: "El carrito no existe"})
    }catch(err){
        console.log(err)
        res.status(500).send({status: "Error", reason: "Error del servidor, intente mas tarde"})
    }
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



