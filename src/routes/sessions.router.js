const express = require('express')
const passport = require('passport')
const { Router } = express
const router = new Router()
const ServiceMongo = require('../dao/dbService.js')
const { checkLogin, voidLogAndRegis } = require('../utils/utils.js')

//Instanciar el administrador de la DB
const serviceMongo = new ServiceMongo()

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
        else res.status(500).send({status: "ERROR"})
    })
})

router.get("/fail", (req,res)=>{
    const {error} = req.query
    error === "register" && res.render("register", {error: true})
    error === "login" && res.render("login", {error: true})
    error === "github" && res.render("login", { githubError: true })
})

router.get("/current", checkLogin,(req, res) =>{
    res.status(200).send({status:"Success", currentUser: req.session})
})

/**
* POST 
**/

router.post("/register", passport.authenticate('register',{failureRedirect: "/api/sessions/fail?error=register"}),
(req, res) =>{
    res.redirect("/api/sessions/login")
})

//email === "adminCoder@coder.com" && password === "adminCod3r123" 
router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/fail?error=login"}),
async (req, res)=>{
    //Si se ejecuta la funcion es porque se logró el proceso de autenticación
    const userFound = req.user
    req.session.user = userFound.name
    req.session.lastName = userFound.lastName
    req.session.email = userFound.email
    req.session.age = userFound.age
    req.session.rol = userFound.rol
    req.session.carts = userFound.carts
    userFound.rol === "Admin" && (req.session.admin = true)
    res.redirect("/products")
})
  
module.exports = router