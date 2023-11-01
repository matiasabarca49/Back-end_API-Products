const bcrypt = require('bcrypt')
const { Faker, es } = require('@faker-js/faker')
const ServiceMongo = require('../service/dbMongoService.js')
const Product = require('../dao/mongo/models/productsModels.js')

let secretSaved = []

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

const reWriteDocsDB = async (Model, documentFormat) =>{
    const documentsReWrited = []
    const documentsFromBase = await serviceMongo.getDocuments(Model)
    documentsFromBase.forEach( document => {
        
        if(documentFormat === "Product"){
            const documentReWrited = {
                title: document.title || "Not Declared",
                description: document.description || "Not Declared",
                price: document.price || "Not Declared",
                code: document.code || "Not Declared",
                stock: document.stock || "Not Declared",
                status: document.status || "Not Declared",
                category: document.category || "Not Declared",
                owner: document.owner || "Not Declared",
                id: document.id 
            }
            documentsReWrited.push(documentReWrited)
        }
        else if(documentFormat === "User"){
            const documentReWrited = {
                name: document.name || "Not Declared",
                lastName: document.lastName || "Not Declared",
                age: document.age || "Not Declared",
                email: document.email || "Not Declared",
                rol: document.rol || "Not Declared",
                id: document.id 
            }
            documentsReWrited.push(documentReWrited)
        }
    })
    return documentsReWrited
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

const saveSecret = (secretCreated)=>{
    secretSaved.push(secretCreated)
    //Borrar clave guardada para deshabilitar link
    setTimeout( ()=>{
       secretSaved = secretSaved.filter( secret => secret != secretCreated)
    },3600000)
}

const searchSecret = (secretToSearch, userMail)=>{
    const isValid = isValidPassword( {password: secretToSearch}, `Cod!34fdsert${userMail}`)
    if (isValid){
        const secretFound = secretSaved.find( secret => secret === `${secretToSearch}&qui=45604545rgfdt355iuiljhgfds/&>S43&filter=user&type=change&user=notFound`)
        if (secretFound){
            return true
        }
        else{
            return false
        }    
    }else{
        return false
    }
}

//General Formato Email
generateFormatEmail = (email, payload) =>{
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
}

module.exports= {
    createHash,
    isValidPassword,
    checkLogin,
    voidLogAndRegis,
    reWriteDocsDB,
    generateProducts,
    saveSecret,
    searchSecret,
    generateFormatEmail
}