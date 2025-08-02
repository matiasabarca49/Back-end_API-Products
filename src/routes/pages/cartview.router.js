const express = require('express')
const { Router } = express
const router = new Router()
//middleware
const { checkPermAdmin } = require('../../middlewares/permissions.middleware.js')


router.get("/", checkPermAdmin,(req,res)=>{
    res.render("cartview", {userLoged: req.session})
})


module.exports = router
