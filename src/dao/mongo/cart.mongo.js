const ServiceMongo = require('../../service/dbMongoService')
const serviceMongo = new ServiceMongo()
const Cart = require('../mongo/models/cartsModels')
const Product = require('../mongo/models/productsModels')
const User = require('../mongo/models/usersModels')

class CartManager {
    constructor(){

    }

    getCart(ID){
        return serviceMongo.getDocumentsByID(Cart ,ID)
    }

   async getPurchase(idCart, idUser){
        const productsWithoutStock = []
        const productsWithStock = []
        const cartDB = await serviceMongo.getDocumentsByID(Cart,idCart)
        const products = await serviceMongo.getDocuments(Product)
        //Separar productos con stock y sin stock
        cartDB.products.forEach( productDB => {
            const productFound = products.find( product => product._id.toString() === productDB.product._id.toString())
            if (productDB.quantity <= productFound.stock){
                productsWithStock.push(productDB)
            }else{
                productsWithoutStock.push(productDB)  
            }
        } )
        //Actualizar stock en DB
        productsWithStock.forEach( async product => {
            const productFound = await serviceMongo.getDocumentsByID(Product, product.product._id)
            const productUpdated = await serviceMongo.updateDocument(Product, productFound._id.toString(),{stock: productFound.stock - product.quantity})
        })
        //Guardar la compra en el usuario
        const user = await serviceMongo.getDocumentsByID(User, idUser)
        const purchaseUpdated = [...user.purchases, { dateCart: cartDB.dateCart, cart: productsWithStock}]
        await serviceMongo.updateDocument(User, idUser, {purchases: purchaseUpdated})
        //Dejar en carrito solo productos sin stock
        await serviceMongo.updateDocument(User, idUser, {cart: productsWithoutStock})
        return {purchases: purchaseUpdated, cart: productsWithoutStock, purchase: productsWithStock}
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