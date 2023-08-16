const bcrypt = require('bcrypt')
const ServiceMongo = require('../service/dbMongoService.js')
const Product = require('../dao/mongo/models/productsModels.js')

//Encriptación
const createHash = (password) => {
   return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
   
}

const isValidPassword = (user ,password) =>{
    return bcrypt.compareSync(password, user.password)
    
}

//Check Login
function checkLogin(req, res, next){
    if(req.session.user){
        next()
    }
    else{
        res.redirect("/api/sessions/login")
    }
}

function voidLogAndRegis(req, res, next){
    if(req.session.user){
        res.redirect("/api/sessions/perfil")
    }
    else{
        next()
    }
}

//Reescrituras de documentos DB
//Debido a un error o directiva de Handlebars los productos son reescritos para lograr que handlebars renderice
const serviceMongo =  new ServiceMongo()

const reWriteDocsDB = async () =>{
    const productsReWrited = []
    const productsFromBase = await serviceMongo.getDocuments(Product)
    productsFromBase.forEach( product => {
        const productReWrited = {
            title: product.title,
            description: product.description,
            price: product.price,
            code: product.code,
            stock: product.stock,
            status: product.status,
            category: product.category,
            id: product.id
        }
        productsReWrited.push(productReWrited)
    })
    return productsReWrited
}

module.exports= {
    createHash,
    isValidPassword,
    checkLogin,
    voidLogAndRegis,
    reWriteDocsDB
}