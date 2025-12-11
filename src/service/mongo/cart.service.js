const Cart = require('../../model/carts.model.js')
const BaseService = require('./base.service.js')
const CartDTO = require('../../dto/cart.dto.js')

class CartService extends BaseService{
    constructor(){
        super(Cart)
    }

   async getPurchase(idCart, idUser){
        //Para evitar dependecinas circulares, importo los servicios acá dentro del método
        //Los require dentro de funciones no tienen penalización de performance en Node.js
        const UserService = require('./users.service.js')
        const ProductService = require('./products.service.js')
        const TicketService = require('./ticket.service.js')

        const productService = new ProductService()
        const productsWithoutStock = []
        const productsWithStock = []
        const cartDB = await this.persistController.getDocumentsByID(idCart)
        const products = await productService.getAll()
        //Separar productos con stock y sin stock
        cartDB.products.forEach( productDB => {
            const productFound = products.find( product => product.id.toString() === productDB.product._id.toString())
            if (productDB.quantity <= productFound.stock){
                productsWithStock.push(productDB)
            }else{
                productsWithoutStock.push(productDB)  
            }
        } )
        //Actualizar stock en DB
        productsWithStock.forEach( async product => {
            const productFound = await productService.getById(product.product.id)
            await productService.update(productFound.id.toString(),{stock: productFound.stock - product.quantity})
        })
        //Guardar la compra en el usuario y dejar en carrito solo productos sin stock
        const userService = new UserService()
        const user = await userService.getById(idUser)
        const purchaseUpdated = [...user.purchases, { dateCart: cartDB.dateCart, cart: productsWithStock}]
        await userService.update(idUser, {purchases: purchaseUpdated, cart: productsWithoutStock})
        //Generar Ticket
        const ticketService = new TicketService()
        const ticket = { user: user, cart: productsWithStock, idCart: idCart }
        const newTicket = await ticketService.create(ticket)
        return {purchases: purchaseUpdated, cart: productsWithoutStock, purchase: productsWithStock, ticket: newTicket}
    }

    
    async postProductInCart(cartID, productID){
        return await this.persistController.addProductToCartInDB(cartID, productID)
    }

    async putFullCartInDB(cartID, newCart){
        return await this.persistController.updateCartInDB(cartID, newCart)
    }

    async putProductCartInDB(cartID, productID, quantity){
        return await this.persistController.addProductToCartInDB(cartID, productID, quantity)
    }


    async delProductInCart(cartID, productID){
        return await this.persistController.deleteProductCartInDB(cartID, productID )
    }

    async delFullCart(cartID){
        return await this.persistController.deleteFullCartInDB(cartID)
    }

    /* delTicket(tCode){
        return persistController.deleteDocumentByFilter(Ticket, {code: tCode})
    } */

     /**
     * 
     *Wrapper Pattern
        */

    toFormatDTO(cartData) {
        return new CartDTO(cartData)
    }

    toDTO(cartData) {
        return CartDTO.toResponse(cartData) 
    }

    toManyDTO(carts) {
        return carts.map(cart => CartDTO.toResponse(cart)) 
    }
}

module.exports = CartService