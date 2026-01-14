const UsersService = require('../service/users.service.js')
const usersService = new UsersService()

const getLogout = async (req, res) =>{
    try{
        if(req.session.passport?.user) await usersService.updateLastConnection(req.session.passport.user)
        req.session.destroy( async err =>{
            if(!err) res.redirect("/users/login")
            else res.status(500).send({status: "ERROR"})
        })
    }catch(error){ 
        req.logger.error(`Peticion ${req.method} en "${"http://"+req.headers.host + "/api/sessions/logout" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}\n
        ERROR: Fallo al cerrar la sesión. EL error es:\n
        ${error}`)
        res.status(500).send({status: "ERROR", reason: error})
    }
}


const getUserCurrent = (req, res) =>{
    try{
        res.status(200).send({status:"Success", currentUser: req.session})
    }catch(error){
        req.logger.error(`Peticion ${req.method} en "${"http://"+req.headers.host + "/api/sessions/current" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}\n
        ERROR: Fallo al obtener el usuario actual. EL error es:\n
        ${error}`)
        res.status(500).send({status: "ERROR", reason: error})
    }
}

const registerUser = (req, res) =>{
    try{
        res.redirect("/users/login")
    }catch(error){
        req.logger.error(`Peticion ${req.method} en "${"http://"+req.headers.host + "/api/sessions/register" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}\n
        ERROR: Fallo al registrar el usuario. EL error es:\n
        ${error}`)
        res.status(500).send({status: "ERROR", reason: error})
    }
}

const loginUser = async (req, res)=>{
    try{
        //Si se ejecuta la funcion es porque se logró el proceso de autenticación
        const userFound = req.user
        req.session.user = userFound.name
        req.session.lastName = userFound.lastName
        req.session.email = userFound.email
        req.session.age = userFound.age
        req.session.rol = userFound.rol
        req.session.lastConnection = userFound.lastConnection
        req.session.cart = userFound.cart
        req.session.purchases = userFound.purchases
        if(req.session.rol === "Admin"){
            res.redirect("/admin")
        }else{
            res.redirect("/")
        }
    }catch(error){
        req.logger.error(`Peticion ${req.method} en "${"http://"+req.headers.host + "/api/sessions/login" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}\n
        ERROR: Fallo al loguear el usuario. EL error es:\n
        ${error}`)
        res.status(500).send({status: "ERROR", reason: error})
    }
}

module.exports = {
    getLogout,
    getUserCurrent,
    registerUser, 
    loginUser
}