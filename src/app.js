/* require('dotenv').config() */
const config = require('./config/config.js')
const express = require("express")
const handlebars = require("express-handlebars")
const http = require('http')
const app = express()
const server = http.createServer(app)

//Inicio y conexion a DB
const MongoManager = require('./dao/mongo/db.js')
const mongoManager = new MongoManager(`mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster-mongo-coder-tes.qh8sdrt.mongodb.net/ecommerce`)

//Sessions
const session = require('express-session')
const mongoSession = require('connect-mongo')

app.use(session({
    store: mongoSession.create({
        mongoUrl: `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster-mongo-coder-tes.qh8sdrt.mongodb.net/ecommerce`,
        mongoOption: {useNewUrlParser: true, useUnifiedTopology: true}
    }),
    secret: process.env.SECRET_SESSIONS ,
    resave: true,
    saveUninitialized: false
}))

//Passport
const passport = require('passport')
const initializePassport = require('./config/passport.config.js')
//Estrategia de autorizacion de terceros
require('./config/passport.github.js')
//Config de passport con estrategias
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//Parsear los datos que viene en formato JSON
app.use(express.json())
//recibir datos complejos del navegador
app.use(express.urlencoded({extended: true}))
//Archivos estaticos
app.use(express.static(__dirname + '/public'))
//Compresion
const compression = require('express-compression')
app.use(compression())
//Logger
const addLogger = require('./service/logger/loggers.js')
app.use(addLogger)


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
const routeLoggerTest = require('./routes/logger.router.js')
const routeSessions = require('./routes/sessions.router.js')
const routeUsers = require('./routes/users.router.js')
const routeViewHome = require('./routes/pages/home.router.js')
const routeMocks = require('./routes/mocks.router.js')
const routeViewRealTimeProducts = require('./routes/pages/realTimeProducts.router.js')
const routeViewProducts = require('./routes/pages/products.router.js')
const routeViewCart = require('./routes/pages/cartview.router.js')
const routeGithubAuth = require('./routes/passport/github.passport.router.js')
const routeError = require('./routes/pages/404.router.js')


app.use("/api/products", routeProducts)
app.use("/api/carts", routeCarts)
app.use("/api/sessions", routeSessions)
app.use("/api/users", routeUsers)
app.use("/auth", routeGithubAuth)
app.use("/", routeViewHome)
app.use("/mockingproducts", routeMocks)
app.use("/chat", routeChat)
app.use("/loggerTest", routeLoggerTest)
app.use("/realtimeproducts", routeViewRealTimeProducts)
app.use("/products", routeViewProducts)
app.use("/carts", routeViewCart)
app.use('*', routeError)

/**
 * Websockets 
 **/
const { webSocket } = require('./controllers/websockets.controller.js')
webSocket(server)


//Levantar el servidor para que empiece a escuchar
server.listen(`${config.port}`, ()=>{ 
    console.log("Environment Mode Option: ", config.environment);
    console.log(`El servidor está escuchando en el puerto ${config.port}`)
    //Conectar base de datos
    mongoManager.connect()
})