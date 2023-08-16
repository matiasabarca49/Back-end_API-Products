const ServiceMongo = require('../../service/dbMongoService')
const serviceMongo = new ServiceMongo()
const Cart = require('../mongo/models/cartsModels')

class CartManager {
    constructor(){

    }

    getCart(ID){
        return serviceMongo.getDocumentsByID(Cart ,ID)
    }

    postCart(cart){
        return serviceMongo.createNewDocument(Cart, cart)
    }

    postProductInCart(cartID, productID){
        return serviceMongo.addProductToCartInDB(Cart, cartID, productID)
    }

    putFullCartInDB(cartID, newCart){
        return serviceMongo.updateCartInDB(Cart, cartID, newCart)
    }

    putProductCartInDB(cartID, productID, quantity){
        return serviceMongo.addProductToCartInDB(Cart, cartID, productID, quantity)
    }

    delProductInCart(cartID, productID){
        return serviceMongo.deleteProductCartInDB( Cart, cartID, productID )
    }

    delFullCart(cartID){
        return serviceMongo.deleteFullCartInDB(Cart, cartID)
    }

}

module.exports = CartManager