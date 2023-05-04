const express = require("express")

const app = express()

//Parsear los datos que viene en formato JSON
app.use(express.json())
//recibir datos complejos del navegador
app.use(express.urlencoded({extended: true}))

const routeProducts = require('./routes/products.router.js')
const routeCarts = require('./routes/cart.router.js')

app.use("/api/products", routeProducts)
app.use("/api/carts", routeCarts)

app.get("/", (req,res) =>{
    
    res.send(`
    <h1>Data desde el back-end</h1>
    <p> <b>"/api/products"</b> para obtener todos los productos </p>
    <p> <b>"/api/products/id"</b> para obtener un producto específico </p>
    <p> <b>"/api/products?limit=X"</b> donde <b>X</b> es un número para obtener una cantidad especifica</p>
    <p> <b>"/api/carts/cid"</b> para obtener carrito por ID </p>
    ` )
})


//Levantar el servidor para que empiece a escuchar
app.listen("8080", ()=> console.log("El servidor está escuchando"))