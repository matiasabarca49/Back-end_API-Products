const UsersService = require('../service/mongo/users.service.js')
const usersService = new UsersService()

/**
* GET
*/

const getUsers = async (req, res) =>{
    try{
        const usersGetted = await usersService.getAll()
        res.status(200).send({status: "Succesfull", users: usersGetted})
    }catch(error){
        console.log(error)
        res.status(500).send({status: "Error", reason: error.message || "Error al obtener los usuarios"})
    }
}

const getUserByFilter = async (req, res) =>{
    try{
        const filter = req.query
        const userGetted = await usersService.getByFilter(filter)
        res.status(200).send({status: "Succesfull", user: userGetted})
    }catch(error){
        console.log(error)
        res.status(500).send({status: "Error", reason: error.message || "Error al obtener el usuario"})
    }

}

const changeRol = async (req, res) =>{
    try{
        const userUpdated = await usersService.putChangeRolFromUser(req.params.uid)
        userUpdated.status
            ? res.status(201).send({status: "Succesfull", userUpdated: userUpdated.userUpdated})
            : res.status(500).send({status: "ERROR", reason: userUpdated.reason ||"Los Administradores no pueden cambiar de rol"})
    }catch(error){
        console.log(error)
        res.status(500).send({status: "Error", reason: error.message || "Error al cambiar el rol del usuario"})
    }
}
/**
* POST
*/

const createUser = async (req, res) =>{
    try{
        const userCreated = await usersService.create(req.body)
        res.status(201).send({status: "Succesfull", user: userCreated})
    }catch(error){
        console.log(error)
        res.status(error.statusCode || 500).send({status: "Error", reason: error.message || "Error al crear el usuario"})
    }
}



/**
* PUT
*/

const addProductToCartFromUser = async (req,res) =>{
    try{
        const datedUser = await usersService.postProductToCart(req.session.passport.user, req.body)
        if (datedUser){
            //Para que se actualice el usuario sin tener que salir y volver entrar a la cuenta
            req.session.cart = datedUser.cart
            res.status(201).send({status:" Succesfull ",userUpdated: datedUser.cart})

        }else{
            res.status(500).send({status: "ERROR" , reason: "No puede agregar un producto propio"})
        }
    }catch(error){
        console.log(error)
        res.status(500).send({status: "Error", reason: error.message || "Error al agregar el producto al carrito"})
    }
}

const addDocumentsInUser = async (req, res) => {
    try{
        const isValid = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"].includes(req.file.originalname.split(".")[0])
        if(isValid){
            const document ={
                name:req.file.originalname,
                reference: req.file.path
            }
            const userUpdated = await usersService.postDocument(req.params.uid, document)
            res.status(201).send({status: "Charged", file: userUpdated.documents[userUpdated.documents.length - 1]})
        }
        else{
            res.status(500).send({status: "Error"})
        }
    }catch(error){
        console.log(error)
        res.status(500).send({status: "Error", reason: error.message || "Error al agregar el documento al usuario"})
    }
}

/**
* DELETE
*/
const delUser = async (req, res) =>{
    try{
        const userDeleted = await usersService.delete(req.params.id)
        userDeleted 
            ? res.status(200).send({status: "Successful", user: userDeleted})
            : res.status(500).send({status: "Error", reason: "El usuario no existe o error en el servidor"})
    }catch(error){
        console.log(error)
        res.status(500).send({status: "Error", reason: error.message || "Error al eliminar el usuario"})
    }
}

const delUserForConnectionn = async (req, res) =>{
    try{
        const usersUpdated = await usersService.delUserForTimeDisconnection()
        res.send(usersUpdated)
    }catch(error){
        console.log(error)
        res.status(500).send({status: "Error", reason: error.message || "Error al eliminar los usuarios inactivos"})
    }
}

const delProductFromUser = async(req, res)=>{
    try{
        const cartUpdated = await usersService.delProductFromUser(req.session.passport.user, req.params.id)
        console.log("Usuario Actualizado: ", cartUpdated)
        //Actualiza el cart del usuario
        req.session.cart = cartUpdated
        userUpdated
            ? res.send({status: "Successful", cart: cartUpdated})
            : res.status(500).send({status: "Error"})
    }catch(error){
        console.log(error)
        res.status(500).send({status: "Error", reason: error.message || "Error al eliminar el producto del carrito"})
    }
}

module.exports = {
    getUsers,
    getUserByFilter,
    changeRol,
    createUser,
    addProductToCartFromUser,
    addDocumentsInUser,
    delUser,
    delUserForConnectionn,
    delProductFromUser
}