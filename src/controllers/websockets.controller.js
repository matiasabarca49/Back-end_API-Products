const { Server } = require('socket.io')
//Errors
const CustomError = require('../utils/errors/customError')
const { generateProductErrorInfo } = require('../utils/errors/messageCreater.js')
const EErrors = require('../utils/errors/ErrorEnums.js')
//Services
const ProductsService = require('../service/mongo/products.service.js')
const MessageService = require('../service/mongo/message.service.js')
const UsersService = require('../service/mongo/users.service.js')

const productsService = new ProductsService()
const messageService = new MessageService()
const usersService = new UsersService()

const webSocket = (server) => {
    const io = new Server(server)
    io.on( 'connection', async (socket)=>{
        //====== Productos ==============
        //enviar al cliente los productos
        console.log("Cliente Conectado al API WebSocket")
        socket.emit('sendProducts', await productsService.getProducts())
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
                    const userFound = await usersService.getUserByFilter({email: owner})
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
                await productsService.postProduct(data)
                io.sockets.emit('sendProducts',  await productsService.getProducts())
            } catch (error) {
                console.log(error)
            }
        })
        //====== Mensajes ===============
        socket.emit("chats", await messageService.getMessage())
        socket.on('msg',async (data)=>{
            await messageService.postMassage(data)
            io.sockets.emit("chats", await messageService.getMessage())
        })
    } )
}

module.exports = {webSocket}