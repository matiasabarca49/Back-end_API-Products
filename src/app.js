const express = require("express")
const ProductManager = require("./ProductManager")

const productManager = new ProductManager("./data/data.json")

const app = express()

app.get("/", (req,res) =>{
    
    res.send(`
    <h1>Data desde el back-end</h1>
    <p> <b>"/products"</b> para obtener todos los productos </p>
    <p> <b>"/products/id"</b> para obtener un producto específico </p>
    <p> <b>"/products?limit=X"</b> donde <b>X</b> es un número para obtener una cantidad especifica</p>
    ` )
})

app.get("/products", (req,res) =>{
    const products = productManager.getProducts()
    if (req.query.limit){
        products.splice(req.query.limit)
    }
    res.send(products)
})


app.get("/products/:id", (req,res) =>{
    const products = productManager.getProducts()
    const productFound = products.find( product => product.id === parseFloat(req.params.id))
    res.send(productFound)
})


app.listen("8080", ()=> console.log("El servidor está escuchando"))