const { searchSecret } = require('../utils/utils.js')
const UsersManager = require('../dao/mongo/users.mongo.js')
const usersManager = new UsersManager()

const getRegister = (req, res) =>{
    res.render("register")  
  }
const getLogin = async (req, res) =>{
    res.render("login")
}
const getPerfil = async (req, res) =>{
    res.render("perfil", {userLoged: req.session})
}

const getChangePassword = (req,res)=>{
    res.render('forgetPassword')
}
const getGeneratePassword = (req,res)=>{
    const secretFound = searchSecret(req.query.secret, req.query.email)
    secretFound
        ?res.render('generatePassword')
        :res.render('forgetPassword')
}   

const getLogout = async (req, res) =>{
    if(req.session.passport?.user) await usersManager.putConnectionUser(req.session.passport.user)
    req.session.destroy( async err =>{
        if(!err) res.redirect("/api/sessions/login")
        else res.status(500).send({status: "ERROR"})
    })
}

const getFail = (req,res)=>{
    const {error} = req.query
    error === "register" && res.render("register", {error: true})
    error === "login" && res.render("login", {error: true})
    error === "github" && res.render("login", { githubError: true })
}

const getUserCurrent = (req, res) =>{
    res.status(200).send({status:"Success", currentUser: req.session})
}

const registerUser = (req, res) =>{
    res.redirect("/api/sessions/login")
}

const loginUser = async (req, res)=>{
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
        res.redirect("/")
    }else{
        res.redirect("/products")
    }
}

module.exports = {
    getRegister,
    getLogin,
    getPerfil,
    getLogout,
    getFail,
    getChangePassword,
    getGeneratePassword,
    getUserCurrent,
    registerUser, 
    loginUser
}