const express = require('express')
const ServiceMongo = require('../../dao/dbService.js')
const Product = require('../../dao/models/productsModels.js')

const { Router } = express
const router = new Router()
const serviceMongo =  new ServiceMongo()

router.get("/",  async (req, res) =>{
    const productsFromBase = await serviceMongo.getDocuments(Product)
    console.log(productsFromBase)
    res.render('home', { products: productsFromBase } )
} )

module.exports = router

