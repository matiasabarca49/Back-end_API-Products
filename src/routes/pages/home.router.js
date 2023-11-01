const express = require('express')
const { reWriteDocsDB, checkLogin } = require('../../utils/utils.js')
const Product = require('../../dao/mongo/models/productsModels.js')
const User = require('../../dao/mongo/models/usersModels.js')
const { Router } = express
const router = new Router()

const ath = (req, res ,next) =>{
    if(req.session.rol === "Admin"){
        next()
    }
    else{
        res.status(401).send({status: "Error", reason: "no autorizado"})
    }
}

router.get("/", checkLogin, ath, async (req, res) =>{
    const products = await reWriteDocsDB(Product, "Product")
    const users = await reWriteDocsDB(User, "User")
    res.render('home',{ products: products, users: users } )
} )

module.exports = router

