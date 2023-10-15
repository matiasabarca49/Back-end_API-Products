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
    

    async getUserByFilter(filter){
        return serviceMongo.getDocumentsByFilter(User, filter)
    }

   async postProductToCart(idUser, productToAdded){
        /* console.log(productToAdded) */
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

   async postDocument(idUser,document){
    let documentsUpdated
    const userFound = await serviceMongo.getDocumentsByID(User, idUser)
    //Buscando si ya existe el documento en DB
    const documentFound = userFound.documents.find( documentDB => documentDB.name === document.name)
    if(documentFound){
       const documentFilter = userFound.documents.filter( documentDB => documentDB.name !== document.name)
        documentsUpdated = [...documentFilter, document]
    }
    else{
        documentsUpdated = [...userFound.documents, document]  
    }
    //Agregamos el documento a la DB
    if(userFound){
        const userUpdated = await serviceMongo.updateDocument(User, idUser, {documents: documentsUpdated})
        return userUpdated
    }else{
        return false
    }
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

   async putChangeRolFromUser(idUser){
        const documents = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"]
        const userFound = await serviceMongo.getDocumentsByID(User, idUser)
        if (userFound.rol === "User"){
            let cont=0
            userFound.documents.forEach( document => {
                if(documents.includes(document.name)){
                    cont++
                }
            })
            if (cont === 3){
                const userUpdated = await serviceMongo.updateDocument(User, idUser,{rol: "Premium"})
                return {status: true, userUpdated: {_id: userUpdated._id, name: userUpdated.name, lastName: userUpdated.lastName, email: userUpdated.email, rol: userUpdated.rol}} 
            }
            else{
                return {status: false, reason: "Faltan Cargar Documentos"}
            }
        }
        else if(userFound.rol === "Premium"){
            const userUpdated = await serviceMongo.updateDocument(User, idUser,{rol: "User"})
            return {status: true, userUpdated: {_id: userUpdated._id, name: userUpdated.name, lastName: userUpdated.lastName, email: userUpdated.email, rol: userUpdated.rol}}
        }
        else{
            return {status: false, reason: "El usuario no fue encontrado"}
        }
    }  

    async putConnectionUser(idUser){
        const date = new Date().toString()
        /* const dateNow = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}hs` */
        const userFound = await serviceMongo.getDocumentsByID(User, idUser)
        if(userFound){
            const userUpdated = await serviceMongo.updateDocument(User, idUser,{lastConnection: date})
            return userUpdated
        }else{
            return false
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