const { createHash} = require('../../utils/utils.js')
class UserDTO{
    constructor(user){
        this.name = user.name
        this.lastName = user.lastName || "No especificado"
        this.age = user.age || 0
        this.email = user.email
        this.password = createHash(user.password)
        this.rol = "User"
        this.carts = []
    }
}

module.exports = UserDTO