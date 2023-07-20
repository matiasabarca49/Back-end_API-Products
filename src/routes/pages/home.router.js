const express = require('express')
const { reWriteDocsDB, checkLogin } = require('../../utils/utils.js')

const { Router } = express
const router = new Router()

router.get("/", checkLogin,  async (req, res) =>{
    const products = await reWriteDocsDB()
    res.render('home',{ products: products } )
} )

module.exports = router

