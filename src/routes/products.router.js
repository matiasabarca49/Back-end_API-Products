const express = require('express')
//controllers
const {getProducts, getById, getSearchProducts, create, addManyProducts, update, deleteProduct, getByFilter, getManageableProducts} = require('../controllers/products.controller.js')
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
router.get("/filter", getByFilter)
router.get("/admin", checkPermAdminAndPremium ,getManageableProducts)
router.get("/search", getSearchProducts)
router.get("/:id", getById)

/**
* POST
**/
router.post("/", checkPerAddProduct,create)
router.post("/manyproducts", checkPerAddProduct,addManyProducts)

/**
* PUT
*/
router.put("/:id", checkPerAddProduct,update)

/**
* DELETE
*/
router.delete("/:id", checkPerAddProduct, deleteProduct)


module.exports = router