const express = require('express')
const ProductManager = require("../ProductManager")

//Desestructuramos el objeto para obtener el constructor de Rutas
const { Router } = express
//Creamos una nueva instancia de Router
const router = new Router()

const productManager = new ProductManager("./data/products.json")


/**
* GET
**/
router.get("/", (req,res) =>{
    const products = productManager.getProducts()
    if (req.query.limit){
        products.splice(req.query.limit)
    }
    res.send({productos: products})
})


router.get("/:id", (req,res) =>{
    const products = productManager.getProducts()
    const productFound = products.find( product => product.id === parseFloat(req.params.id))
    productFound
        ? res.send({producto: productFound})
        : res.send({error: "Producto no encontrado"})
})

/**
* POST
**/

router.post("/", (req, res) =>{
    productManager.addProduct(req.body)
    res.send({status: "Producto creado correctamente", producto: req.body})
})

/**
* PUT
*/

router.put("/:id", (req,res)=>{
    productManager.updateProduct( req.params.id, req.body )
    res.send({status: "Producto actualizado correctamente"})
})

/**
* DELETE
*/

router.delete("/:id", (req,res) => {
    productManager.deleteProduct(req.params.id)
    res.send({status: "Producto borrado correctamente"})
})


module.exports = router