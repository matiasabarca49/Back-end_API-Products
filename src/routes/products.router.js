const express = require('express')
//controllers
const {getProducts, getProductsByID, addProduct, addManyProducts, updateProduct, deleteProduct} = require('../controllers/products.controller.js')

//Desestructuramos el objeto para obtener el constructor de Rutas
const { Router } = express
//Creamos una nueva instancia de Router
const router = new Router()

const ath = (req, res ,next) => {
    if (req.session.rol === "Admin" || req.session.rol === "Premium" ){
        next()
    }
    else{
        res.send("Los usuarios comunes no puede administrar productos o no ha iniciado sesión")
    }
}

/**
* GET
**/
router.get("/", getProducts)
router.get("/:id", getProductsByID)

/**
* POST
**/
router.post("/", ath,addProduct)
router.post("/manyproducts", ath,addManyProducts)

/**
* PUT
*/
router.put("/:id", ath,updateProduct)

/**
* DELETE
*/
router.delete("/:id", ath, deleteProduct)


module.exports = router