const Product = require('../../model/products.model.js')
const User = require('../../model/users.model.js')
const { reWriteDocsDB} = require('../../utils/utils.js')

const getUsersPageController = async (req, res) =>{
    const products = await reWriteDocsDB(Product, "Product")
    const users = await reWriteDocsDB(User, "users")
    res.render('home',{ products: products, users: users, userLoged: req.session } )
} 

module.exports = { getUsersPageController }