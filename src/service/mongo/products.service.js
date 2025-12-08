const Product = require('../../model/products.model.js')
const BaseService = require('./base.service.js')
const { transporter } = require('../../config/config.js')
const { generateFormatEmail } = require('../../utils/utils.js')
const ProductDTO = require('../../dto/product.dto.js')

class ProductsService extends BaseService{
    constructor(){
        super(Product)
    }

   /*  getProductsPaginate(dftQuery, dftLimit, dftPage, dftSort){
        return this.persistController.getPaginate(this.model, dftQuery, dftLimit, dftPage, dftSort)
    } */

    /* getProducts(){
        return this.persistController.getDocuments(Product)
    }

    getProductsByID(ID){
        return this.persistController.getDocumentsByID(Product, ID)
    }
    getProductsByFilter(filter){
        return this.persistController.getDocumentsByFilter(Product, filter)
    } */

    getProductsSearch(query){
        const searchRegex = new RegExp(query, 'i')
        return this.persistController.getDocumentsByQuery( 
                {
                    $or: [
                        { title: searchRegex },
                        { category: searchRegex },
                        { code: searchRegex },
                        { owner: searchRegex},
                        { _id: query.match(/^[0-9a-fA-F]{24}$/) ? query : null }, // si q parece un ObjectId válido
                    ]
                })
    }

    /* postProduct(product){
        return this.persistController.createNewDocument(this.model, product)
    } */

    /* postManyProducts(products){
        return this.persistController.createManyDocuments(this.model, products)
    } */

    /* putProduct(ID, productToChange){
        return this.persistController.updateDocument(this.model, ID, productToChange)
    } */

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
        const productFound = await this.persistController.getDocumentsByID(ID)
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
               return this.persistController.deleteDocument(ID) 
           }
           else{
            return false
           }
        }
        else if(user.rol === "Admin"){
            return this.persistController.deleteDocument(ID)

        }
        else{
            return false
        }
    }

    /**
         * 
         *Wrapper Pattern
         */
    
        toFormatDTO(productData) {
            return new ProductDTO(productData)
        }
    
        toDTO(product) {
            return ProductDTO.toResponse(product) 
        }
    
        toManyDTO(products) {
            return products.map(product => ProductDTO.toResponse(product)) 
        }
}

module.exports = ProductsService