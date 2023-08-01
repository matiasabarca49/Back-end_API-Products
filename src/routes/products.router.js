const express = require('express')
//controllers
const {getProducts, getProductsByID, addProduct, addManyProducts, updateProduct, deleteProduct} = require('../controllers/products.controllers.js')

//Desestructuramos el objeto para obtener el constructor de Rutas
const { Router } = express
//Creamos una nueva instancia de Router
const router = new Router()

/**
* GET
**/
router.get("/", getProducts)
router.get("/:id", getProductsByID)

/**
* POST
**/
router.post("/", addProduct)
router.post("/manyproducts", addManyProducts)

/**
* PUT
*/
router.put("/:id", updateProduct)

/**
* DELETE
*/
router.delete("/:id", deleteProduct)


module.exports = router