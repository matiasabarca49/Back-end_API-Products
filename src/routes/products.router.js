const express = require('express')
//controllers
const {getProducts, getProductsByID, getSearchProducts, addProduct, addManyProducts, updateProduct, deleteProduct, getProductsByFilter, getAdmProduct} = require('../controllers/products.controller.js')
//middleware
const { checkPerAddProduct, checkPermAdminAndPremium } = require('../middlewares/permissions.middleware.js')

//Desestructuramos el objeto para obtener el constructor de Rutas
const { Router } = express
//Creamos una nueva instancia de Router
const router = new Router()


/**
* GET
**/
router.get("/", getProducts)
router.get("/filter", getProductsByFilter)
router.get("/admin", checkPermAdminAndPremium ,getAdmProduct)
router.get("/search", getSearchProducts)
router.get("/:id", getProductsByID)

/**
* POST
**/
router.post("/", checkPerAddProduct,addProduct)
router.post("/manyproducts", checkPerAddProduct,addManyProducts)

/**
* PUT
*/
router.put("/:id", checkPerAddProduct,updateProduct)

/**
* DELETE
*/
router.delete("/:id", checkPerAddProduct, deleteProduct)


module.exports = router