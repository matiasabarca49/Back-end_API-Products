const express = require("express")
const handlebars = require("express-handlebars")
const ProductManager = require("./ProductManager.js")

const app = express()

//Parsear los datos que viene en formato JSON
app.use(express.json())
//recibir datos complejos del navegador
app.use(express.urlencoded({extended: true}))
//Archivos estaticos
app.use(express.static(__dirname + '/public'))


//Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Routes
const routeProducts = require('./routes/products.router.js')
const routeCarts = require('./routes/cart.router.js')


app.use("/api/products", routeProducts)
app.use("/api/carts", routeCarts)


//Vista Home
app.get("/", (req,res) =>{
    const productManager = new ProductManager('./data/products.json')
    const productsFromBase = productManager.getProducts()
    res.render('home', { products: productsFromBase } )
})

//Productos en tiempo real
app.get( "/realtimeproducts", (req,res) => {
    res.render('realTimeProducts')
})



//Levantar el servidor para que empiece a escuchar
app.listen("8080", ()=> console.log("El servidor está escuchando"))