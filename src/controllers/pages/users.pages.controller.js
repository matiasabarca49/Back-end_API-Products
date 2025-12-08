const ProductsService = require('../../service/mongo/products.service.js')
const UsersService = require('../../service/mongo/users.service.js')
const { reWriteDocsDB} = require('../../utils/utils.js')

const getUsersPageController = async (req, res) =>{
    const usersService =  new UsersService()
    const productsService = new ProductsService()

    //Reescribimos los documentos para que handlebars los pueda renderizar
    const products = await reWriteDocsDB("products", await productsService.getAll())
    const users = await reWriteDocsDB("users", await usersService.getAll())
    res.render('home',{ products: products, users: users, userLoged: req.session } )
} 

module.exports = { getUsersPageController }