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
        const cartDB = await this.getById(idCart)
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

    //Funcion que agrega un producto en un carrito que ya se encuentre en la DB
    async addProductInCart(cartID, productID, quantity){
        //Obtenemos el carrito al que se quiere agregar productos
        const cart = await this.getById(cartID)
         if (cart){
            //verificamos si el producto ya existe en el carrito
            const productFound = cart.products.find( item => item.product.id.toString() === productID )
            //Se incrementa la cantidad si existe sino se agrega el producto al array
            productFound
                //Si la funcion recibe el parametro "quantty" endpoint(PUT), se modifica la cantidad por lo recibido si no se recibe endpoint(post), se  incrementa.
                ? quantity? productFound.quantity = quantity : productFound.quantity++
                : cart.products = [...cart.products, {product: productID, quantity: 1}]
           //Se actualiza el cart con el metodo creado anteriormente. Este metodo ya no devuelve el documeto actualizado
           const cartUpdated = await this.update(cartID, {products: cart.products})
           return this.toDTO? this.toDTO(cartUpdated) : cartUpdated
        }
        else{
            return null
        }
    }

    async updateFullCartInDB(cartID, newCart){
         const cart = await this.getById(cartID)
        if (cart){
            const cartUpdated = await this.update(cartID, {products: newCart})
            return this.DTO? this.DTO(cartUpdated) : cartUpdated
        }
        else{
            return false
        }
    }


    async delProductInCart(cartID, productID){
        const cart = await this.getById(cartID)
        if (cart){
            let cartUpdated
            const productFound = cart.products.find(  item => item.product._id.toString() === productID )
            productFound
                ? cart.products = cart.products.filter( item => item.product._id.toString() !== productID)  
                : cartUpdated = false
            const cartOnlyID= cart.products.map(  item => {
                return {
                    product: item.product._id.toString(),
                    quantity: item.quantity
                }
            }  )
            cartUpdated = await this.updateFullCartInDB(cartID, cartOnlyID) 
            return this.DTO? this.DTO(cartUpdated) : cartUpdated
        }
        else{
            return false
        }  
    }

    async delFullCart(cartID){
        const cart = await this.getById(cartID)
        if(cart){
           const cartUpdated = await this.updateFullCartInDB(cartID, []) 
            return this.DTO? this.DTO(cartUpdated) : cartUpdated
        }
        else{
            return false
        }
    }

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