const { createHash} = require('../utils/utils.js')

class UserDTO{
    constructor(user){
        this.name = user.name
        this.lastName = user.lastName || "No especificado"
        this.age = user.age || 0
        this.email = user.email
        this.password = createHash(user.password)
        this.rol = "User"
        this.documents = []
        this.lastConnection = new Date().toISOString()
        this.purchases = []
        this.cart = []
    }

    static toResponse(user){
        return {
            id: user.id, 
            name: user.name || "Not Declared",
            lastName: user.lastName || "Not Declared",
            age: user.age || "Not Declared",
            email: user.email || "Not Declared",
            rol: user.rol || "Not Declared",
            lastConnection: user.lastConnection || "Not Declared",
            documents: user.documents || [],
            purchases: user.purchases || [],
            cart: user.cart || []
        }
    }
    
}

const sendUserFormatted = (user) => {
    
    const userFormatted = {
        id: user._id, 
        name: user.name || "Not Declared",
        lastName: user.lastName || "Not Declared",
        age: user.age || "Not Declared",
        email: user.email || "Not Declared",
        rol: user.rol || "Not Declared",
        lastConnection: user.lastConnection || "Not Declared",
        documents: user.documents || [],
        purchases: user.purchases || [],
        cart: user.cart || []
    }
          
    return userFormatted
}

const sendUsersFormatted = (users) => {
    users.map( document => {   
            const documentReWrited = {
                id: document._id, 
                name: document.name || "Not Declared",
                lastName: document.lastName || "Not Declared",
                age: document.age || "Not Declared",
                email: document.email || "Not Declared",
                rol: document.rol || "Not Declared",
                lastConnection: document.lastConnection || "Not Declared",
                documents: document.documents || [],
                purchases: document.purchases || [],
                cart: document.cart || []
            }
            return documentReWrited
    })
    return users
}

module.exports = {
    UserDTO,
    sendUserFormatted,
    sendUsersFormatted
}