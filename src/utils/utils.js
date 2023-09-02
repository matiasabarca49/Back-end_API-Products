const bcrypt = require('bcrypt')
const { Faker, es } = require('@faker-js/faker')
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

//Generación de Mock
const generateProducts = (nroUser)=>{
    const faker = new Faker({ locale: [es] });
    let users = []
    try {
        for(let i=0; i < nroUser ; i++){
            const newProduct = {
                    _id: faker.database.mongodbObjectId(),
                    title: faker.commerce.product(),
                    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet, ligula ac porttitor tempus, dolor enim dictum eros, cursus mollis lorem libero ut massa. Aenean ut dui tellus. Cras eleifend nibh id est consectetur aliquet. Duis sagittis erat nunc, mattis consectetur dui fringilla maximus.",
                    price: faker.commerce.price({ min: 1000, max: 20000}),
                    thumbnail: "Sin Imagen",
                    code: faker.string.uuid(),
                    stock: faker.number.int(300),
                    status: true,
                    category:faker.helpers.arrayElement(["Tecnología", "Ropa", "Bazar","Accesorios","Calzado"])
            }
            users.push(newProduct)
        }
    } catch (error) {
        console.log(error)
        return false
    }
    return users
}

module.exports= {
    createHash,
    isValidPassword,
    checkLogin,
    voidLogAndRegis,
    reWriteDocsDB,
    generateProducts
}