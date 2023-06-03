const express = require("express")
const handlebars = require("express-handlebars")
const MongoManager = require('./dao/db.js')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

//Inicio y conexion a DB
const mongoManager = new MongoManager("mongodb+srv://coderTest-1:jVd13ilZAKE7LUl8@cluster-mongo-coder-tes.qh8sdrt.mongodb.net/ecommerce")

const messages= []

//Para obtener los producto almacenados hasta ahora
/* const ProductManager = require("./dao/fileManager/ProductManager.js")
const productManager = new ProductManager('./data/products.json') */



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
const routeChat = require('./routes/chat.router.js')

app.use("/api/products", routeProducts)
app.use("/api/carts", routeCarts)
app.use("/chat", routeChat)

/**
 * Websockets 
 **/

io.on( 'connection', async (socket)=>{
    //enviar al cliente los productos
    console.log("Cliente Conectado")
    socket.emit('sendProducts', await mongoManager.getProductFromDB())
    //Agregar producto nuevo a base de datos
    socket.on('newProductToBase', async (data) =>{
        await mongoManager.addProductToMongo(data)
        io.sockets.emit('sendProducts', await mongoManager.getProductFromDB())
    })
    //Chat de mensajes
    socket.emit("chats", messages)
    socket.on('msg',(data)=>{
        /* console.log(data) */
        messages.push(data)
        io.sockets.emit("chats", messages)
    })
} )

/** 
 *EndPoints 
 **/

//Vista Home
app.get("/", async (req,res) =>{
    
    const productsFromBase = await mongoManager.getProductFromDB()
    console.log(productsFromBase)
    res.render('home', { products: productsFromBase } )
})

//Productos en tiempo real
app.get( "/realtimeproducts", (req,res) => {
    res.render('realTimeProducts')
})



//Levantar el servidor para que empiece a escuchar
server.listen("8080", ()=>{ 
    console.log("El servidor está escuchando")
    //Conectar base de datos
    mongoManager.connect()
})