const express = require('express')
const { Router } = express
const router = new Router()
const ServiceMongo = require('../dao/dbService.js')
const User = require('../dao/models/usersModels.js')

//Instanciar el administrador de la DB
const serviceMongo = new ServiceMongo()

//Funciones
function checkLogin(req, res, next){
    if(req.session.user){
        next()
    }
    else{
        res.redirect("/api/sessions/login")
    }
}

function voidLogAndRegis(req, res, next){
    if(req.session.user){
        res.redirect("/api/sessions/perfil")
    }
    else{
        next()
    }
}


/**
* GET 
**/

router.get("/register", voidLogAndRegis,(req, res) =>{
  res.render("register")  
})

router.get("/login", voidLogAndRegis, async (req, res) =>{
    res.render("login")
})
router.get("/perfil", checkLogin, async (req, res) =>{
    res.render("perfil", {userLoged: req.session})
    
})

router.get("/logout", (req, res) =>{
    req.session.destroy( err =>{
        if(!err) res.redirect("/api/sessions/login")
        else res.send({status: "ERROR"})
    })
})

/**
* POST 
**/

router.post("/register", async (req, res) =>{
    const user = req.body
    user.rol = "User"
    const userAdded =  await serviceMongo.createNewDocument(User, user)
    userAdded
        ?res.redirect("/api/sessions/login")
        :res.send({status: "ERROR", reason: "El email ya existe o error al crear usuario"}) 
})

router.post("/login", async (req, res) =>{
    const { email, password } = req.body
    const userFound = await serviceMongo.getDocumentsByFilter(User, { email : email})
    const checkPassword =  userFound.password === password
    if (userFound && checkPassword){
        req.session.user = userFound.name
        req.session.lastName = userFound.lastName
        req.session.email = userFound.email
        req.session.age = userFound.age
        req.session.rol = userFound.rol
        res.redirect("/products")
    }
    else{
        res.send({status: "ERROR", reason: "Email o Password erroneos"})
    }
})
  

module.exports = router