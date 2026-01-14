const { createHash, isValidPassword } = require('../utils/utils.js') 
const User = require('../model/users.model.js')
const { UserDTO } = require('../dto/user.dto.js')
const { transporter } = require('../config/config.js')
const { generateFormatEmail } = require('../utils/utils.js')
const BaseService = require('./base.service.js')
const MongoRepository = require('../repositories/implementations/mongoRepository.js')


class UsersService extends BaseService{
    constructor(){
        const mongoRepository = new MongoRepository(User)
        super(mongoRepository)
    }

   async addProductToCart(idUser, productToAdded){
        const userFound = await this.findById(idUser)
        if(userFound.email === productToAdded.owner){
            return false
        }
        const productFound = userFound.cart.find( product => product.product._id.toString() === productToAdded.id)
        productFound 
            ? productFound.quantity++
            : userFound.cart = [...userFound.cart, {product: productToAdded.id, quantity: 1 }]
        await this.update(idUser, {cart: userFound.cart})

        return await this.findById(idUser)
   }

   async addDocument(idUser,document){
    let documentsUpdated
    const userFound = await this.findById(idUser)
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
        const userUpdated = await this.update(idUser, {documents: documentsUpdated})
        return userUpdated
    }else{
        return false
    }
   }

   async updatePassword(emailUser, password){
        const user = await this.findRawByFilter({ email: emailUser})
        //Revisar que la contraseña no sea igual a la anterior
        const isRepeated = isValidPassword(user, password)
        if(isRepeated){
            return {status: false, reason: "No se puede usar contraseñas anteriores"}
        }
        const userUpdate = await this.update(user._id, {password: createHash(password)})
        if(userUpdate){
            
            return {status: true, reason: "Contraseña cambiada con éxito"}
        }else{
            return {status: false, reason: "Error en el cambio de contraseña"}
        }    
       
   }

   async updateRol(idUser){
        const documents = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"]
        const userFound = await this.findById(idUser)
        if (userFound.rol === "User"){
            let cont=0
            userFound.documents.forEach( document => {
                if(documents.includes(document.name)){
                    cont++
                }
            })
            if (cont === 3){
                const userUpdated = await this.update(idUser,{rol: "Premium"})
                return {status: true, userUpdated: {_id: userUpdated._id, name: userUpdated.name, lastName: userUpdated.lastName, email: userUpdated.email, rol: userUpdated.rol}} 
            }
            else{
                return {status: false, reason: "Faltan Cargar Documentos"}
            }
        }
        else if(userFound.rol === "Premium"){
            const userUpdated = await this.update(idUser,{rol: "User"})
            return {status: true, userUpdated: {_id: userUpdated._id, name: userUpdated.name, lastName: userUpdated.lastName, email: userUpdated.email, rol: userUpdated.rol}}
        }
        else{
            return {status: false, reason: "El usuario no fue encontrado"}
        }
    }  

    async updateLastConnection(idUser){
        const date = new Date().toISOString()
        const userFound = await this.findById(idUser)
        if(userFound){
            await this.update(idUser,{lastConnection: date})
            userFound.lastConnection = date
            return this.toDTO(userFound)
        }else{
            return false
        }
    }

    async deleteInactiveUser(){
        const oldDate = new Date()
        oldDate.setDate(oldDate.getDate() - 2 )
        const usersToDelete = await this.findManyByFilter({ lastConnection: { $lt: oldDate.toISOString()}, rol: {$ne: "Admin"}})
        const usersDeleted = await this.deleteManyByFilter({ lastConnection: { $lt: oldDate.toISOString()}, rol: {$ne: "Admin"}})
        usersToDelete.forEach( user => {
            transporter.sendMail(generateFormatEmail(user.email, { subject: "Usuario Eliminado", head: "El Usuario fue eliminado correctamente", body: `El Usuario "${user.name} ${user.lastName}" con rol "${user.rol}" fue eliminado. Por ausencia de conexión ${new Date(user.lastConnection).toLocaleString()}.`}))
        } )
        return usersDeleted
    }

    async removeProductFromCart(userID, productID){
        const userFound = await this.findById(userID)
        if(userFound){
            const cartFiltered = userFound.cart.filter( product => product.product._id.toString() !== productID )
            await this.update(userID, {cart: cartFiltered})
            return cartFiltered
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