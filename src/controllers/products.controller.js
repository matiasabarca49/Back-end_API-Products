//Errores custom
const CustomError = require('../service/errors/customError.js')
const { generateProductErrorInfo } = require('../service/errors/messageCreater.js')
const EErrors = require('../service/errors/ErrorEnums.js')
//Administrador de productos
const ProductsManager = require('../dao/mongo/products.mongo.js')
const productsManager = new ProductsManager()

const getProducts = async (req,res) =>{
    //En caso de que no se indiquen las querys por url, al metodo se pasan las por defecto
    let dftLimit, dftPage, dftSort, dftQuery
    req.query.limit && (dftLimit = req.query.limit)
    req.query.page && (dftPage = req.query.page)
    req.query.query && (dftQuery = {category: req.query.query})
    req.query.sort && (dftSort = {price: req.query.sort})
    const products = await productsManager.getProductsPaginate(dftQuery, dftLimit, dftPage, dftSort)
    /* console.log(products) */
    products
        ? res.status(200).send({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            page: products.page,
            nextPage: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink:products.hasPrevPage?`http://localhost:8080/api/products?page=${products.prevPage} ` : null,
            nextLink:products.hasNextPage?`http://localhost:8080/api/products?page=${products.nextPage} `: null,
            })
        : res.status(500).send({status: "Error"})
}

const getProductsByID = async (req,res) =>{
    const productFound = await productsManager.getProductsByID(req.params.id)
    productFound
        ? res.status(200).send({status: "Success", producto: productFound})
        : res.status(404).send({status: "Error", reason: "Producto no encontrado"})
}

const addProduct = async (req, res) =>{
    const {title, code, stock} = req.body
    try {
        if(!title || !code || !stock || stock < 1){
            const customError = new CustomError()
            customError.createError({
                name:"Product creation error",
                cause: generateProductErrorInfo(req.body),
                message: "Error to create Product",
                code: EErrors.CREATE_PRODUCT_ERROR

            })
        }
        //Si el body es correcto
        //Agregar el usuario que creó el producto
        if(req.session.rol === "Premium"){
            req.body.owner = req.session.email
        }
        else{
            req.body.owner = "Admin"
        }
        const productAdded = await productsManager.postProduct(req.body)
        productAdded
            ?res.status(201).send({status: "Success", action: "Producto agregado a DB correctamente", producto: productAdded})
            :res.status(400).send({status: "Error", action: 'Campos Faltantes, mal escritos o  campo code repetido'})
    } catch (error) {
        console.log(error)
        res.status(400).send({status: "Error", action: 'Campos Faltantes o inválidos'})
    }
    
}

const addManyProducts = async (req, res) =>{
    const prs = await productsManager.postManyProducts(req.body)
    productAdded
        ?res.status(201).send({status: "Success", action: "Producto agregado a DB correctamente", productos: prs})
        :res.status(400).send({status: "Error", action: 'Campos Faltantes, mal escritos o  campo code repetido'})
}

const updateProduct = async (req,res)=>{
    const productUpdated = await productsManager.putProduct(req.params.id, req.body)
    productUpdated
     ? res.status(200).send({status: "Success", action: "Producto actualizado correctamente", product: productUpdated})
     : res.status(400).send({status: "Error", reason: "Al producto le faltan campos o no existe "})   
 }

const deleteProduct = async (req,res) => {
    const user = req.session
    const productDelete = await productsManager.delProduct(req.params.id, user)
    productDelete
     ?res.status(200).send({status: "Success", action: "Producto borrado correctamente", product: productDelete})
     :res.status(404).send({status: "Error", reason: "El producto no existe o no tienes permiso para borrarlo"})
}


module.exports = {
    getProducts,
    getProductsByID,
    addProduct,
    addManyProducts,
    updateProduct,
    deleteProduct
}