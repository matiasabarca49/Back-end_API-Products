const ServiceMongo = require('../service/dbService.js')
const User = require('../dao/models/usersModels.js')
const serviceMongo = new ServiceMongo()

/**
* PUT
*/
const addCartToUser = async (req, res) => {
    const {idUser,idCart } = req.body
    const datedUser = await serviceMongo.updateCartFromUser(User, idUser, idCart)
    if(datedUser){
        //Para que se actualice el usuario sin tener que salir y volver entrar a la cuenta
        req.session.carts = datedUser.carts
        res.status(201).send({status:"success", datedUser: datedUser})
    }
    else{
        res.status(500).send({status: "ERROR"})
    }
} 

module.exports = {
    addCartToUser
}