const express = require('express')
const ServiceMongo = require('../../dao/dbService.js')
const Product = require('../../dao/models/productsModels.js')

const { Router } = express
const router = new Router()
const serviceMongo =  new ServiceMongo()

//Debido a un error o directiva de Handlebars los productos son reescritos para lograr que handlebars renderice
const reWrite = async () =>{
    const productsReWrited = []
    const productsFromBase = await serviceMongo.getDocuments(Product)
    productsFromBase.forEach( product => {
        const productReWrited = {
            title: product.title,
            description: product.description,
            price: product.price,
            code: product.code,
            stock: product.stock,
            status: product.status,
            category: product.category,
            id: product.id
        }
        productsReWrited.push(productReWrited)
    })
    return productsReWrited
}

router.get("/",  async (req, res) =>{
    const products = await reWrite()
    res.render('home',{ products: products } )
} )

module.exports = router

