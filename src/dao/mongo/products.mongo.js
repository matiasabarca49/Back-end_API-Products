const Product = require('../mongo/models/productsModels')
const User = require('../mongo/models/usersModels')
const ServiceMongo = require('../../service/dbMongoService')
const serviceMongo = new ServiceMongo()

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
    
    async delProduct(ID, user){
        if (user.rol === "Premium"){
            const productFound = await serviceMongo.getDocumentsByID(Product, ID)
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