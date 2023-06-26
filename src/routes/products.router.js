const express = require('express')
/* const MongoManager = require("../dao/db.js") */
const ServiceMongo = require('../dao/dbService.js')
//Modelos
const Product = require('../dao/models/productsModels.js')



//Desestructuramos el objeto para obtener el constructor de Rutas
const { Router } = express
//Creamos una nueva instancia de Router
const router = new Router()

//Instanciamos el administrador de la DB
const serviceMongo = new ServiceMongo()


/**
* GET
**/
router.get("/", async (req,res) =>{
    //En caso de que no se indiquen las querys por url, al metodo se pasan las por defecto
    let dftLimit, dftPage, dftSort, dftQuery
    req.query.limit && (dftLimit = req.query.limit)
    req.query.page && (dftPage = req.query.page)
    req.query.query && (dftQuery = {category: req.query.query})
    req.query.sort && (dftSort = {price: req.query.sort})
    const products = await serviceMongo.getPaginate(Product, dftQuery, dftLimit, dftPage, dftSort)
    /* console.log(products) */
    products
        ? res.status(201).send({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            page: products.page,
            nextPage: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink:products.hasPrevPage?`http://localhost:8080/api/products?page=${products.prevPage} ` : null,
            nextLink:products.hasNextPage?`http://localhost:8080/api/products?page=${products.nextPage} `: null,
            })
        : res.status(500).send({status: "Error"})
})


router.get("/:id", async (req,res) =>{
    const products = await serviceMongo.getDocuments(Product)
    const productFound = products.find( product => product.id === req.params.id)
    productFound
        ? res.send({status: "Success", producto: productFound})
        : res.send({status: "Error", reason: "Producto no encontrado"})
})

/**
* POST
**/

router.post("/", async (req, res) =>{
    const productAdded = await serviceMongo.createNewDocument(Product, req.body)
    productAdded
        ?res.status(201).send({status: "Success", action: "Producto agregado a DB correctamente", producto: productAdded})
        :res.status(500).send({status: "Error", action: 'Campos Faltantes, mal escritos o  campo code repetido'})
})

router.post("/manyproducts", async (req, res) =>{
    const prs = await serviceMongo.createManyDocuments(Product, req.body)
    productAdded
        ?res.status(201).send({status: "Success", action: "Producto agregado a DB correctamente", productos: prs})
        :res.status(500).send({status: "Error", action: 'Campos Faltantes, mal escritos o  campo code repetido'})
})

/**
* PUT
*/

router.put("/:id", async (req,res)=>{
   const productUpdated = await serviceMongo.updateDocument(Product, req.params.id, req.body)
   productUpdated
    ? res.send({status: "Success", action: "Producto actualizado correctamente", product: productUpdated})
    : res.send({status: "Error", reason: "Al producto le faltan campos o no existe "})
    
})

/**
* DELETE
*/

router.delete("/:id", async (req,res) => {
    const productDelete = await serviceMongo.deleteDocument(Product, req.params.id)
    productDelete
     ?res.send({status: "Success", action: "Producto borrado correctamente", product: productDelete})
     :res.send({status: "Error", reason: "El producto no existe"})
})


module.exports = router