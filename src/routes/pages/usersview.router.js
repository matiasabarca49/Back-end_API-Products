const express = require('express')
const { Router } = express
const router = new Router()
const UsersManager = require('../../dao/mongo/users.mongo.js')
const usersManager = new UsersManager()

const ath = (req, res ,next) =>{
    if(req.session.rol === "Admin"){
        next()
    }
    else{
        res.status(401).send({status: "Error", reason: "no autorizado"})
    }
}

router.get("/", ath ,async (req, res)=>{
    res.render("users")
})



module.exports = router