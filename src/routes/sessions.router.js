const express = require('express')
const passport = require('passport')
const { Router } = express
const router = new Router()
//utils
const { checkLogin, voidLogAndRegis } = require('../utils/utils.js')
//controllers
const controller = require('../controllers/sessions.controller.js')

/**
* GET 
**/
router.get("/register", voidLogAndRegis, controller.getRegister)
router.get("/login", voidLogAndRegis, controller.getLogin)
router.get("/perfil", checkLogin, controller.getPerfil)
router.get("/logout", controller.getLogout)
router.get("/fail", controller.getFail)
router.get("/current", checkLogin, controller.getUserCurrent)
router.get("/forgetpassword", controller.getChangePassword)
router.get("/generatepassword", controller.getGeneratePassword)

/**
* POST 
**/
router.post("/register", passport.authenticate('register',{failureRedirect: "/api/sessions/fail?error=register"}),
controller.registerUser)
//email === "adminCoder@coder.com" && password === "adminCod3r123" 
router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/fail?error=login"}),
controller.loginUser)
  
module.exports = router