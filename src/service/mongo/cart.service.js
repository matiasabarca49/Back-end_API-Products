const PersistController = require('../../dao/mongo/persistController.js')
const persistController = new PersistController()
const Cart = require('../../model/cartsModels.js')
const Product = require('../../model/productsModels.js')
const User = require('../../model/usersModels.js')
const Ticket = require('../../model/ticketsModels.js')
const TicketDTO = require('../../dto/ticket.dto.js')

class CartService {
    constructor(){

    }

    getCart(ID){
        return persistController.getDocumentsByID(Cart ,ID)
    }

   async getPurchase(idCart, idUser){
        const productsWithoutStock = []
        const productsWithStock = []
        const cartDB = await persistController.getDocumentsByID(Cart,idCart)
        const products = await persistController.getDocuments(Product)
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
            const productFound = await persistController.getDocumentsByID(Product, product.product._id)
            const productUpdated = await persistController.updateDocument(Product, productFound._id.toString(),{stock: productFound.stock - product.quantity})
        })
        //Guardar la compra en el usuario
        const user = await persistController.getDocumentsByID(User, idUser)
        const purchaseUpdated = [...user.purchases, { dateCart: cartDB.dateCart, cart: productsWithStock}]
        await persistController.updateDocument(User, idUser, {purchases: purchaseUpdated})
        //Dejar en carrito solo productos sin stock
        await persistController.updateDocument(User, idUser, {cart: productsWithoutStock})
        //Generar Ticket
        const ticket = new TicketDTO(user, productsWithStock)
        await persistController.createNewDocument(Ticket, ticket)
        return {purchases: purchaseUpdated, cart: productsWithoutStock, purchase: productsWithStock, ticket: ticket}
    }

    postCart(cart){
        return persistController.createNewDocument(Cart, cart)
    }
    
    postProductInCart(cartID, productID){
        return persistController.addProductToCartInDB(Cart, cartID, productID)
    }

    putFullCartInDB(cartID, newCart){
        return persistController.updateCartInDB(Cart, cartID, newCart)
    }

    putProductCartInDB(cartID, productID, quantity){
        return persistController.addProductToCartInDB(Cart, cartID, productID, quantity)
    }

    delCart(cartID){
        return persistController.deleteDocument(Cart, cartID)
    }

    delProductInCart(cartID, productID){
        return persistController.deleteProductCartInDB( Cart, cartID, productID )
    }

    delFullCart(cartID){
        return persistController.deleteFullCartInDB(Cart, cartID)
    }
    delTicket(tCode){
        return persistController.deleteDocumentByFilter(Ticket, {code: tCode})
    }
}

module.exports = CartService