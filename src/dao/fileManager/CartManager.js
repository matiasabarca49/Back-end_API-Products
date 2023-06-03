const fs = require('fs')

class CartManager{
    constructor(url){
        this.carts = []
        this.url = url
    }

    #updateInFile(){
        try {
            this.carts = JSON.parse(fs.readFileSync(this.url, 'utf-8'))
        } catch (error) {
            console.log("El archivo no existe o es erroneo. Creando uno nuevo")
        }
    }

    #writeInFile(){
        try{
            fs.writeFileSync(this.url, JSON.stringify(this.carts,null, 2), 'utf-8')
        }
        catch{
            console.log("Error al escribir en archivo", error)
        }
    }


    addCart(arrayProducts){
        this.#updateInFile()
        const idGenerated = `cart-${this.carts.length}`
        const cart = { id: idGenerated , products: arrayProducts }
        this.carts.push(cart)
        this.#writeInFile()
    }

    addProductToCart(CID, PID){
        this.#updateInFile()
        const cart = this.getCart(CID)
        //si el carrinto no existe retonamos false para informar el error
        if (!cart){
            return false
        }
        //si el producto ya existe se incrementa el campo quantity o se crea nuevo producto y se realiza un push  
        const productFound = cart.products.find( product => product.product === parseFloat(PID))
        if (productFound){
            productFound.quantity++
            this.#writeInFile()
            return productFound
        } else{
            const newProduct = {product: parseFloat(PID), quantity: 1}
            cart.products.push(newProduct)
            this.#writeInFile()
            return newProduct
        }
    }

    getCart(ID){
        this.#updateInFile()
        const cartFound = this.carts.find( cart => cart.id === ID)
        if (cartFound){
            return cartFound
        } else{
            console.log("Carrito no encontrado")
            return false
        }
    }


}


module.exports = CartManager