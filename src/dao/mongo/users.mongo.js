const User = require('../mongo/models/usersModels')
const ServiceMongo = require('../../service/dbMongoService')
const serviceMongo = new ServiceMongo()

class UsersManager{
    constructor(){

    }

   putCart(idUser, idCart){
        const userUpdated = serviceMongo.updateCartFromUser(User, idUser, idCart)
        return  userUpdated
    }

}


module.exports = UsersManager