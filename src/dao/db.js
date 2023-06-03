const mongoose = require('mongoose')
const Product = require('./models/productsModels.js')

class MongoManager{
    constructor(url){
        this.url = url
    }
        
    connect(){
        return mongoose.connect(this.url,
        {useUnifiedTopology: true, 
        useNewUrlParser: true})
            .then(connect => console.log("Conexion a db exitosa"))
            .catch( err => console.log(err))
    }

    async getProductFromDB(){
        let productsFromDB 
        await Product.find()
            .then( products => {
                productsFromDB = products
            } )
            .catch(error =>{
                console.log(error)
            })
        /* console.log(productsFromDB) */
        return productsFromDB
    }

    async addProductToMongo(newProduct,res){
        
        //Verificamos que el producto sea valido con el esquema
        let productAdded 
        const product = new Product(newProduct)
        await product.save()
            .then( pr => {
                productAdded = pr
            })
            .catch( error => {
                console.log(error)
                productAdded = false
            } )
        return productAdded      
    }

    async addManyProductToMongo(arrayProducts){
        let productsAdded
        await Product.insertMany(arrayProducts)
            .then( prs =>{
                productsAdded = prs
            } )
            .catch( err =>{
                console.log(err)
                productsAdded = false
            })
        return productsAdded
    }
}


module.exports = MongoManager