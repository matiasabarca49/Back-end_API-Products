const express = require('express')
const { Router } = express
const router = new Router()
//middleware
const { checkLogin } = require('../../middlewares/sessions.middleware')

router.get("/",(req,res)=>{
    res.render("products", {userLoged: req.session})
})

router.get("/productview", (req,res)=>{
    res.render("productview", {userLoged: req.session})
})
router.get("/pay", checkLogin,(req,res)=>{
    res.render("viewpay", {userLoged: req.session})
})
router.get('/ticket', (req, res)=>{
    res.render("ticket")
})


module.exports = router
