const { createHash, isValidPassword } = require('../../utils/utils.js') 
const User = require('../mongo/models/usersModels')
const ServiceMongo = require('../../service/dbMongoService')
const serviceMongo = new ServiceMongo()

class UsersManager{
    constructor(){

    }

   async getUser(filter){
        const userFound = await serviceMongo.getDocumentsByFilter(User, filter)
        const userFormated ={
            _id: userFound._id,
            email: userFound.email,
            purchases: userFound.purchases,
            cart: userFound.cart
        }
        return userFormated
    }
    
    async putChangeRolFromUser(idUser){
        const userFound = await serviceMongo.getDocumentsByID(User, idUser)
        if (userFound.rol === "User"){
            const userUpdated = await serviceMongo.updateDocument(User, idUser,{rol: "Premium"})
            return userUpdated 
        }
        else if(userFound.rol === "Premium"){
            const userUpdated = await serviceMongo.updateDocument(User, idUser,{rol: "User"})
            return userUpdated 
        }
        else{
            return false
        }
    }

    async getUserByFilter(filter){
        return serviceMongo.getDocumentsByFilter(User, filter)
    }

   async postProductToCart(idUser, productToAdded){
        console.log(productToAdded)
        const userFound = await serviceMongo.getDocumentsByID(User, idUser)
        if(userFound.email === productToAdded.owner){
            return false
        }
        const productFound = userFound.cart.find( product => product.product._id.toString() === productToAdded._id)
        productFound 
            ? productFound.quantity++
            : userFound.cart = [...userFound.cart, {product: productToAdded, quantity: 1 }]
            
        const userUpdated = await serviceMongo.updateDocument(User, idUser, {cart: userFound.cart})
        return userUpdated
   }

   async putChangePasswordFromUser(emailUser, password){
        const user = await serviceMongo.getDocumentsByFilter(User, { email: emailUser})
        //Revisar que la contraseña no sea igual a la anterior
        const isRepeated = isValidPassword(user, password)
        if(isRepeated){
            return {status: false, reason: "No se puede usar contraseñas anteriores"}
        }
        const userUpdate = await serviceMongo.updateDocument(User, user._id, {password: createHash(password)})
        if(userUpdate){
            
            return {status: true, reason: "Contraseña cambiada con éxito"}
        }else{
            return {status: false, reason: "Error en el cambio de contraseña"}
        }    
       
   }

   postPurchases(idUser, idCart){
        const userUpdated = serviceMongo.updateCartFromUser(User, idUser, idCart)
        return  userUpdated
    }

    delUser(IDUser){
        return serviceMongo.deleteDocument(User, IDUser)
    }

}


module.exports = UsersManager