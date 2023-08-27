const User = require('../mongo/models/usersModels')
const ServiceMongo = require('../../service/dbMongoService')
const serviceMongo = new ServiceMongo()

class UsersManager{
    constructor(){

    }

   async postProductToCart(idUser, productToAdded){
        const userFound = await serviceMongo.getDocumentsByID(User, idUser)
        const productFound = userFound.cart.find( product => product.product._id.toString() === productToAdded._id)
        productFound 
            ? productFound.quantity++
            : userFound.cart = [...userFound.cart, {product: productToAdded, quantity: 1 }]
            
        const userUpdated = await serviceMongo.updateDocument(User, idUser, {cart: userFound.cart})
        return userUpdated
   }

   postPurchases(idUser, idCart){
        const userUpdated = serviceMongo.updateCartFromUser(User, idUser, idCart)
        return  userUpdated
    }

}


module.exports = UsersManager