const Product = require('../mongo/models/productsModels')
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

    postProduct(product){
        return serviceMongo.createNewDocument(Product, product)
    }

    postManyProducts(products){
        return serviceMongo.createManyDocuments(Product, products)
    }

    putProduct(ID, productToChange){
        return serviceMongo.updateDocument(Product, ID, productToChange)
    }
    delProduct(ID){
        return serviceMongo.deleteDocument(Product, ID)
    }
}

module.exports = ProductsManager