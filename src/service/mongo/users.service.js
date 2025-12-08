const { createHash, isValidPassword } = require('../../utils/utils.js') 
const User = require('../../model/users.model.js')
const { sendUserFormatted, UserDTO } = require('../../dto/user.dto.js')
const { transporter } = require('../../config/config.js')
const { generateFormatEmail } = require('../../utils/utils.js')
const BaseService = require('./base.service.js')


class UsersService extends BaseService{
    constructor(){
        super(User)
    }

   async postProductToCart(idUser, productToAdded){
        /* console.log(productToAdded) */
        const userFound = await this.persistController.getDocumentsByID(idUser)
        if(userFound.email === productToAdded.owner){
            return false
        }
        const productFound = userFound.cart.find( product => product.product._id.toString() === productToAdded._id)
        productFound 
            ? productFound.quantity++
            : userFound.cart = [...userFound.cart, {product: productToAdded, quantity: 1 }]
            
        const userUpdated = await this.persistController.updateDocument(idUser, {cart: userFound.cart})
        return userUpdated
   }

   async postDocument(idUser,document){
    let documentsUpdated
    const userFound = await this.persistController.getDocumentsByID(idUser)
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
        const userUpdated = await this.persistController.updateDocument(idUser, {documents: documentsUpdated})
        return userUpdated
    }else{
        return false
    }
   }

   async putChangePasswordFromUser(emailUser, password){
        const user = await this.persistController.getDocumentsByFilter({ email: emailUser})
        //Revisar que la contraseña no sea igual a la anterior
        const isRepeated = isValidPassword(user, password)
        if(isRepeated){
            return {status: false, reason: "No se puede usar contraseñas anteriores"}
        }
        const userUpdate = await this.persistController.updateDocument(user._id, {password: createHash(password)})
        if(userUpdate){
            
            return {status: true, reason: "Contraseña cambiada con éxito"}
        }else{
            return {status: false, reason: "Error en el cambio de contraseña"}
        }    
       
   }

   async putChangeRolFromUser(idUser){
        const documents = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"]
        const userFound = await this.persistController.getDocumentsByID(idUser)
        if (userFound.rol === "User"){
            let cont=0
            userFound.documents.forEach( document => {
                if(documents.includes(document.name)){
                    cont++
                }
            })
            if (cont === 3){
                const userUpdated = await this.persistController.updateDocument(idUser,{rol: "Premium"})
                return {status: true, userUpdated: {_id: userUpdated._id, name: userUpdated.name, lastName: userUpdated.lastName, email: userUpdated.email, rol: userUpdated.rol}} 
            }
            else{
                return {status: false, reason: "Faltan Cargar Documentos"}
            }
        }
        else if(userFound.rol === "Premium"){
            const userUpdated = await this.persistController.updateDocument(idUser,{rol: "User"})
            return {status: true, userUpdated: {_id: userUpdated._id, name: userUpdated.name, lastName: userUpdated.lastName, email: userUpdated.email, rol: userUpdated.rol}}
        }
        else{
            return {status: false, reason: "El usuario no fue encontrado"}
        }
    }  

    async putConnectionUser(idUser){
        const date = new Date().toISOString()
        const userFound = await this.persistController.getDocumentsByID(idUser)
        if(userFound){
            await this.persistController.updateDocument(idUser,{lastConnection: date})
            userFound.lastConnection = date
            return this.toDTO(userFound)
        }else{
            return false
        }
    }

    async delUserForTimeDisconnection(){
        const oldDate = new Date()
        oldDate.setDate(oldDate.getDate() - 2 )
        const usersToDelete = await this.persistController.getManyDocumentsByFilter({ lastConnection: { $lt: oldDate.toISOString()}, rol: {$ne: "Admin"}})
        const usersDeleted = await this.persistController.deleteManyDocumentByFilter({ lastConnection: { $lt: oldDate.toISOString()}, rol: {$ne: "Admin"}})
        usersToDelete.forEach( user => {
            transporter.sendMail(generateFormatEmail(user.email, { subject: "Usuario Eliminado", head: "El Usuario fue eliminado correctamente", body: `El Usuario "${user.name} ${user.lastName}" con rol "${user.rol}" fue eliminado. Por ausencia de conexión ${new Date(user.lastConnection).toLocaleString()}.`}))
        } )
        return usersDeleted
    }

    async delProductFromUser(userID, productID){
        const userFound = await this.persistController.getDocumentsByID(userID)
        if(userFound){
            const cartFiltered = userFound.cart.filter( product => product.product._id.toString() !== productID )
            const userUpdated = await this.persistController.updateDocument(userID, {cart: cartFiltered})
            return userUpdated
        }else{
            return false
        }
    } 

    /**
     * 
     *Wrapper Pattern
     */

    toFormatDTO(userData) {
        return new UserDTO(userData)
    }

    toDTO(user) {
        return UserDTO.toResponse(user) 
    }

    toManyDTO(users) {
        return users.map(user => UserDTO.toResponse(user)) 
    }

}


module.exports = UsersService