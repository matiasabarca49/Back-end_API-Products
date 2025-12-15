const CustomError = require("../../utils/errors/customError")
const EErrors = require("../../utils/errors/ErrorEnums")

class PersistController{

    constructor(model){
        this.model = model
    }
    //"Model" hace referencia al "Schema" de una colección
    async getDocuments(){
        //Si la respuesta tiene exito, devuelve los documentos encontrados
        return await this.model.find()
            //Si hay un error, lo muestra por consola y lo lanza para que lo capte la capa superior(Controlador/Servicio)
            .catch(error =>{
                console.log(error)
                throw error
            })
    }

    async getDocumentByID(ID){
        return await this.model.findOne({_id: ID})
            .catch(error =>{
                console.log(error)
                throw error
            })
    
    }

    async getDocumentByFilter(filter){
        return await this.model.findOne(filter)
            .catch(error =>{
                console.log(error)
                throw error
            })
    }

    async getDocumentsByQuery(query){
        return await this.model.aggregate(query)
            .catch(error =>{
                console.log(error)
                throw error
            })
    }

    async getManyDocumentsByFilter(filter){
        return await this.model.find(filter)
            .catch(error =>{
                console.log(error)
                throw error
            })
    }

    async getPaginate(query ,lmit , pag , srt){
        return await this.model.paginate(query || {} ,{limit: lmit || 10 , page: pag || 1, sort: srt || {}})
            .catch(error =>{
                console.log(error)
                throw error
            })
    }

    async createNewDocument(newDocument){
        //Verificamos que el documento sea valido con el esquema(modelo)
        const model = new this.model(newDocument)
        return await model.save()
            .catch( error => {
                if (error.code === 11000) {
                    const customError = new CustomError()
                    customError.createError({
                        name:"Document creation error",
                        cause: 'Datos Duplicados en la Base de Datos',
                        message: "No se puede crear el documento. Verifica tus datos",
                        code: EErrors.DATA_DB_DUPLICATED

                    })
                    throw customError
                }else{
                    throw error
                }
            } )   
    }

    async createManyDocuments(arrayProducts){ 
        return await this.model.insertMany(arrayProducts)
            .catch( err =>{
                console.log(err)
                throw err
            })
    }

    async updateDocument(ID,toUpdate ){
       return await this.model.updateOne({_id: ID}, toUpdate)
            .catch( err =>{
                console.log(err)
                throw err
            })
    }

    async deleteDocument(ID){
        const documentToDelete = await this.getDocumentsByID(ID)
        let documentDeleted 
        await this.model.deleteOne({_id: ID})
            .then( dt =>{
                documentDeleted = documentToDelete
            } )
            .catch( err => {
                console.log(err)
                documentDeleted= false
            } )
        return documentDeleted
    }
    
    async deleteDocumentByFilter(filter){
        const documentToDelete = await this.getDocumentsByFilter(filter)
        let documentDeleted 
        await this.model.deleteOne(filter)
            .then( dt =>{
                documentDeleted = documentToDelete
            } )
            .catch( err => {
                console.log(err)
                documentDeleted= false
            } )
        return documentDeleted
    }

    async deleteManyDocumentByFilter(filter){
        let documentsDeleted 
        await this.model.deleteMany(filter)
            .then( dt =>{
                documentsDeleted = dt
            } )
            .catch( err => {
                console.log(err)
                documentsDeleted= false
            } )
        return documentsDeleted
    }

    /**
     * Métodos para el cart  
     **/ 

    //Funcion que agrega un producto en un carrito que ya se encuentre en la DB
    async addProductToCartInDB(IDCart, IDProduct, quantty){
        //Obtenemos el carrito al que se quiere agregar productos
        const cart = await this.getDocumentsByID(IDCart)
        //Verificamos que el cart exista
        if (cart){
            //el "item.product._id.toString()" es debido al formato de id que entrega la DB
            const productFound = cart.products.find( item => item.product._id.toString() === IDProduct )
            //Se incrementa la cantidad si existe sino se agrega el producto al array
            productFound
                //Si la funcion recibe el parametro "quantty" endpoint(PUT), se modifica la cantidad por lo recibido si no se recibe endpoint(post), se  incrementa.
                ? quantty? productFound.quantity = quantty : productFound.quantity++
                : cart.products = [...cart.products, {product: IDProduct, quantity: 1}]
           //Se actualiza el cart con el metodo creado anteriormente. Este metodo ya no devuelve el documeto actualizado
           const cartUpdated = await this.updateDocument(IDCart, {products: cart.products})
           return cartUpdated
        }
        else{
            return false
        }
    }

    async updateCartInDB(IDCart, newCart){
        const cart = await this.getDocumentsByID(IDCart)
        if (cart){
            const cartUpdated = await this.updateDocument(IDCart, {products: newCart})
            return cartUpdated
        }
        else{
            return false
        }
    }

    async deleteProductCartInDB(IDCart, IDProduct){
        const cart = await this.getDocumentsByID(IDCart)
        if (cart){
            let cartUpdated
            const productFound = cart.products.find(  item => item.product._id.toString() === IDProduct )
            productFound
                ? cart.products = cart.products.filter( item => item.product._id.toString() !== IDProduct)  
                : cartUpdated = false
            const cartOnlyID= cart.products.map(  item => {
                return {
                    product: item.product._id.toString(),
                    quantity: item.quantity
                }
            }  )
            cartUpdated = await this.updateCartInDB(IDCart, cartOnlyID) 
            return cartUpdated
        }
        else{
            return false
        }  
    }

    async deleteFullCartInDB(IDCart){
        const cart = await this.getDocumentsByID(IDCart)
        if(cart){
           const cartUpdated = await this.updateCartInDB(IDCart, []) 
            return cartUpdated
        }
        else{
            return false
        }
    }
}

module.exports = PersistController