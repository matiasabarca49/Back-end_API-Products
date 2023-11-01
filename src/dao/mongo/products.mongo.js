const Product = require('../mongo/models/productsModels')
const User = require('../mongo/models/usersModels')
const ServiceMongo = require('../../service/dbMongoService')
const serviceMongo = new ServiceMongo()
const { transporter } = require('../../config/config.js')
const { generateFormatEmail } = require('../../utils/utils.js')

class ProductsManager {
    constructor(){

    }

    getProductsPaginate(dftQuery, dftLimit, dftPage, dftSort){
        return serviceMongo.getPaginate(Product, dftQuery, dftLimit, dftPage, dftSort)
    }

    getProducts(){
        return serviceMongo.getDocuments(Product)
    }

    getProductsByID(ID){
        return serviceMongo.getDocumentsByID(Product, ID)
    }
    getProductsByFilter(filter){
        return serviceMongo.getDocumentsByFilter(Product, filter)
    }

    postProduct(product){
        return serviceMongo.createNewDocument(Product, product)
    }

    postManyProducts(products){
        return serviceMongo.createManyDocuments(Product, products)
    }

    putProduct(ID, productToChange){
        return serviceMongo.updateDocument(Product, ID, productToChange)
    }

    /* generateFormatEmail = (email, payload) =>{
        const mailOptions = {
            from: `Tienda de Productos  <${process.env.GMAIL_CREDENTIAL_USER}>`,
            to: `${email}`,
            subject: `${payload.subject}`,
            html:`
                <div>  
                    <h1> ${payload.head} </h1>
                    <p> ${payload.body} </p>
                </div>
            `,
            attachments: []  
        }
    
        return mailOptions
    } */
    
    async delProduct(ID, user){
        const productFound = await serviceMongo.getDocumentsByID(Product, ID)
        //Enviar mail al propietario del producto
        if( productFound.owner !== "Admin"){
            transporter.sendMail(generateFormatEmail(productFound.owner, { subject: "Producto Borrado", head: "El Producto fue borrado correctamente", body: `El producto "${productFound.title}" con código "${productFound.code}" fue borrado. Por el administrador ${user.user} ${user.lastName}. El producto pertenece al usuario con email ${productFound.owner}`}), (error, info)=>{
                if(error){
                    req.logger.error(`Peticion ${req.method} en "${"http://"+req.headers.host + "/api/mail" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}\n
                    ERROR: Fallo al enviar el mail. EL error es:\n
                    ${error}`)
                    res.status(500).send({status: "ERROR", reason: error}) 
                }
                else{
                    req.logger.info(`Mensaje enviado con éxito solicitado en el endpoint${"http://"+req.headers.host + "/api/mail" +req.url}"`)
                }
            })
        }
        //Eliminar el producto. "Admin" puede eliminar todos los productos, "El propietario solo puede eliminar sus productos"
        if (user.rol === "Premium"){
           if (user.email === productFound.owner){
               return serviceMongo.deleteDocument(Product, ID) 
           }
           else{
            return false
           }
        }
        else if(user.rol === "Admin"){
            return serviceMongo.deleteDocument(Product, ID)

        }
        else{
            return false
        }
    }
}

module.exports = ProductsManager