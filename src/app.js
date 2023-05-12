const express = require("express")
const handlebars = require("express-handlebars")
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

//Para obtener los producto almacenados hasta ahora
const ProductManager = require("./ProductManager.js")
const productManager = new ProductManager('./data/products.json')



//Parsear los datos que viene en formato JSON
app.use(express.json())
//recibir datos complejos del navegador
app.use(express.urlencoded({extended: true}))
//Archivos estaticos
app.use(express.static(__dirname + '/public'))


/** 
* Handlebars
**/

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

/** 
* Routes
**/

const routeProducts = require('./routes/products.router.js')
const routeCarts = require('./routes/cart.router.js')

app.use("/api/products", routeProducts)
app.use("/api/carts", routeCarts)


/**
 * Websockets 
 **/

io.on( 'connection', (socket)=>{
    socket.emit("updateProducts", productManager.getProducts())
    socket.on('response', (data) =>{
        console.log(data)
    })
} )

/** 
 *EndPoints 
 **/

//Vista Home
app.get("/", (req,res) =>{
    
    const productsFromBase = productManager.getProducts()
    res.render('home', { products: productsFromBase } )
})

//Productos en tiempo real
app.get( "/realtimeproducts", (req,res) => {
    res.render('realTimeProducts')
})



//Levantar el servidor para que empiece a escuchar
server.listen("8080", ()=> console.log("El servidor está escuchando"))