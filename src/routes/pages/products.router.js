const express = require('express')
const { Router } = express
const router = new Router()



router.get("/",(req,res)=>{
    res.render("products", {userLoged: req.session})
})

router.get("/productview", (req,res)=>{
    res.render("productview")
})


/**
 * POST   
**/

/* router.post("/login", (req, res)=>{
    console.log(req.body)
    res.send("Recibido POST")
}) */


module.exports = router
