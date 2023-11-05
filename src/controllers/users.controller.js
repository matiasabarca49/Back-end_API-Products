const UsersManager = require('../dao/mongo/users.mongo.js')
const usersManager = new UsersManager()


/**
* GET
*/

const getUsers = async (req, res) =>{
    const usersGetted = await usersManager.getUsers()
    usersGetted
        ? res.status(200).send({status: "Succesfull", users: usersGetted})
        : res.status(500).send({status: "Error"})
}

const changeRol = async (req, res) =>{
    const userUpdated = await usersManager.putChangeRolFromUser(req.params.uid)
    userUpdated.status
        ? res.status(201).send({status: "Succesfull", userUpdated: userUpdated.userUpdated})
        : res.status(500).send({status: "ERROR", reason: userUpdated.reason ||"Los Administradores no pueden cambiar de rol"})
}

/**
* PUT
*/

const addProductToCartFromUser = async (req,res) =>{
    const datedUser = await usersManager.postProductToCart(req.session.passport.user, req.body)
    if (datedUser){
        //Para que se actualice el usuario sin tener que salir y volver entrar a la cuenta
        req.session.cart = datedUser.cart
        res.status(201).send({status:" Succesfull ",userUpdated: datedUser.cart})

    }else{
        res.status(500).send({status: "ERROR" , reason: "No puede agregar un producto propio"})
    }
}

const addDocumentsInUser = async (req, res) => {
    const isValid = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"].includes(req.file.originalname.split(".")[0])
    if(isValid){
        const document ={
            name:req.file.originalname,
            reference: req.file.path
        }
        const userUpdated = await usersManager.postDocument(req.params.uid, document)
        res.status(201).send({status: "Charged", file: userUpdated.documents[userUpdated.documents.length - 1]})
    }
    else{
        res.status(500).send({status: "Error"})
    }
}

/**
* DELETE
*/
const delUser = async (req, res) =>{
    const userDeleted = await usersManager.delUser(req.params.id)
    userDeleted 
        ? res.status(200).send({status: "Successful", user: userDeleted})
        : res.status(500).send({status: "Error", reason: "El usuario no existe o error en el servidor"})
}

const delUserForConnectionn = async (req, res) =>{
    const usersUpdated = await usersManager.delUserForTimeDisconnection()
    res.send(usersUpdated)
}

const delProductFromUser = async(req, res)=>{
    const userUpdated = await usersManager.delProductFromUser(req.session.passport.user, req.params.id)
    //Actualiza el cart del usuario
    req.session.cart = userUpdated.cart
    userUpdated
        ? res.send({status: "Successful", cart: userUpdated.cart})
        : res.status(500).send({status: "Error"})
}

module.exports = {
    getUsers,
    changeRol,
    addProductToCartFromUser,
    addDocumentsInUser,
    delUser,
    delUserForConnectionn,
    delProductFromUser
}