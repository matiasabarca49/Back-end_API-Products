const Product = require('../model/products.model.js')
const BaseService = require('./base.service.js')
const { transporter } = require('../config/config.js')
const { generateFormatEmail } = require('../utils/utils.js')
const ProductDTO = require('../dto/product.dto.js')
const mongoose = require('mongoose')
const MongoRepository = require('../repositories/implementations/mongoRepository.js')


class ProductsService extends BaseService{
    constructor(){
        const mongoRepository = new MongoRepository(Product)
        super(mongoRepository)
    }

    async findProductsSearch(query, user){
        const searchRegex = new RegExp(query, 'i')
        const products = await this.findByQuery([ 
                {
                    $match: {
                        owner: user.rol === "Premium" ? user.email : "Admin" , // filtro obligatorio
                        $or: [ // con que coincida alguna. Ya devuelve
                            { title: searchRegex },
                            { category: searchRegex },
                            { code: searchRegex },
                            { _id: query.match(/^[0-9a-fA-F]{24}$/) ? new mongoose.Types.ObjectId(query): null }
                        ]
                    }
                }])

        if(!products || products.length === 0) return []

        return this.toManyDTO(products)
    }


    async findManageableProducts(user ,query ,dftLimit, dftPage, dftSort){
        /* const owner = user.rol === "Premium" ? user.email : "Admin"
        query = query? {category: query, owner: owner} : { owner: owner } */
        let newQuery = {}
        if (user.rol === "Premium"){
            newQuery.owner = user.email
        }
        if (query){
            newQuery.category = query
        }
        const documents = await this.findPaginate(newQuery, dftLimit, dftPage, dftSort)
        return documents
    }

    async delProduct(ID, user){
        const productFound = await this.findById(ID)
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
               return this.delete(ID) 
           }
           else{
            return false
           }
        }
        else if(user.rol === "Admin"){
            return this.delete(ID)

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