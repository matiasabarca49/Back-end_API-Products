const ProductsService = require('../../service/products.service.js')
const UsersService = require('../../service/users.service.js')
const { reWriteDocsDB} = require('../../utils/utils.js')

const getUsersPageController = async (req, res) =>{
    const usersService =  new UsersService()
    const productsService = new ProductsService()

    //Reescribimos los documentos para que handlebars los pueda renderizar
    const products = await reWriteDocsDB("products", await productsService.findAll())
    const users = await reWriteDocsDB("users", await usersService.findAll())
    res.render('admin',{ products: products, users: users, userLoged: req.session } )
} 

module.exports = { getUsersPageController }