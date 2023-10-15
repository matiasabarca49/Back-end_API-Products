const express = require('express')
const { reWriteDocsDB, checkLogin } = require('../../utils/utils.js')
const Product = require('../../dao/mongo/models/productsModels.js')
const User = require('../../dao/mongo/models/usersModels.js')

 
const { Router } = express
const router = new Router()

router.get("/", checkLogin,  async (req, res) =>{
    const products = await reWriteDocsDB(Product)
    const users = await reWriteDocsDB(User)
    res.render('home',{ products: products, users: users } )
} )

module.exports = router

