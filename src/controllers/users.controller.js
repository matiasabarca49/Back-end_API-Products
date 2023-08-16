const UsersManager = require('../dao/mongo/users.mongo.js')
const usersManager = new UsersManager()

/**
* PUT
*/
const addCartToUser = async (req, res) => {
    const {idUser,idCart } = req.body
    const datedUser = await usersManager.putCart(idUser, idCart)
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