const { Server } = require('socket.io')
//Errors
const CustomError = require('../service/errors/customError')
const { generateProductErrorInfo } = require('../service/errors/messageCreater.js')
const EErrors = require('../service/errors/ErrorEnums.js')
//Managers
const ProductsManager = require('../dao/mongo/products.mongo.js')
const productsManager = new ProductsManager()
const MessageManager = require('../dao/mongo/message.mongo.js')
const messageManager = new MessageManager()
const UsersManager = require('../dao/mongo/users.mongo')
const usersManager = new UsersManager()

const webSocket = (server) => {
    const io = new Server(server)
    io.on( 'connection', async (socket)=>{
        //====== Productos ==============
        //enviar al cliente los productos
        console.log("Cliente Conectado")
        socket.emit('sendProducts', await productsManager.getProducts())
        //Agregar producto nuevo a base de datos
        socket.on('newProductToBase', async (data) =>{
            //Constrolando de errores
            const { title, code, stock, owner} = data
            try {
                if(!title || !code || !stock || stock < 1 || !owner){
                    const customError = new CustomError()
                    customError.createError({
                        name:"Product creation error",
                        cause: generateProductErrorInfo(data),
                        message: "Error to create Product",
                        code: EErrors.CREATE_PRODUCT_ERROR
        
                    })
                }
                //Verificar que el owner sea un mail valido
                if(owner !== "Admin") {
                    const userFound = await usersManager.getUserByFilter({email: owner})
                    if(!userFound || userFound.rol === "User"){
                        const customError = new CustomError()
                        customError.createError({
                            name:"Product creation error",
                            cause: generateProductErrorInfo(data),
                            message: "Error to create Product",
                            code: EErrors.USER_NOT_FOUND
                        })
                    }
                }
                //En caso de que no falten campos y el owner sea válido se procede a agregar el producto
                await productsManager.postProduct(data)
                io.sockets.emit('sendProducts',  await productsManager.getProducts())
            } catch (error) {
                console.log(error)
            }
        })
        //====== Mensajes ===============
        socket.emit("chats", await messageManager.getMessage())
        socket.on('msg',async (data)=>{
            await messageManager.postMassage(data)
            io.sockets.emit("chats", await messageManager.getMessage())
        })
    } )
}

module.exports = {webSocket}