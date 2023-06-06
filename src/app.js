const express = require("express")
const handlebars = require("express-handlebars")
const { Server } = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

//Inicio y conexion a DB
const MongoManager = require('./dao/db.js')
const mongoManager = new MongoManager("mongodb+srv://coderTest-1:jVd13ilZAKE7LUl8@cluster-mongo-coder-tes.qh8sdrt.mongodb.net/ecommerce")

//Metodos para trabajar en la DB
const ServiceMongo = require('./dao/dbService.js')
const serviceMongo = new ServiceMongo()
//Modelos
const Product = require('./dao/models/productsModels.js') 
const Message = require('./dao/models/messagesModels.js') 

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
const routeViewHome = require('./routes/views/home.router.js')
const routeViewRealTimeProducts = require('./routes/views/realTimeProducts.router.js')

app.use("/api/products", routeProducts)
app.use("/api/carts", routeCarts)
app.use("/chat", routeChat)
app.use("/", routeViewHome)
app.use("/realtimeproducts", routeViewRealTimeProducts)

/**
 * Websockets 
 **/
io.on( 'connection', async (socket)=>{
    //====== Productos ==============
    //enviar al cliente los productos
    console.log("Cliente Conectado")
    socket.emit('sendProducts', await serviceMongo.getDocuments(Product))
    //Agregar producto nuevo a base de datos
    socket.on('newProductToBase', async (data) =>{
        await serviceMongo.createNewDocument(Product, data)
        io.sockets.emit('sendProducts',  await serviceMongo.getDocuments(Product))
    })
    //====== Mensajes ===============
    socket.emit("chats", await serviceMongo.getDocuments(Message))
    socket.on('msg',async (data)=>{
        /* console.log(data) */
        await serviceMongo.createNewDocument(Message, data)
        io.sockets.emit("chats", await serviceMongo.getDocuments(Message))
    })
} )

//Levantar el servidor para que empiece a escuchar
server.listen("8080", ()=>{ 
    console.log("El servidor está escuchando")
    //Conectar base de datos
    mongoManager.connect()
})