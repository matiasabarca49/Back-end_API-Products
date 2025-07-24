const express = require('express')
const { reWriteDocsDB} = require('../../utils/utils.js')
const Product = require('../../model/productsModels.js')
const User = require('../../model/usersModels.js')
const { Router } = express
const router = new Router()
//middleware
const {checkLogin} = require("../../middlewares/sessions.middleware.js")
const { checkPermAdmin } = require('../../middlewares/permissions.middleware.js')

router.get("/", checkLogin, checkPermAdmin, async (req, res) =>{
    const products = await reWriteDocsDB(Product, "Product")
    const users = await reWriteDocsDB(User, "User")
    res.render('home',{ products: products, users: users } )
} )

module.exports = router

