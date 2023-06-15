class ServiceMongo{

    constructor(){

    }
    //"Model" hace referencia al "Schema" de una colección
    async getDocuments(Model){
        let documentsFromDB 
        await Model.find()
            .then( dt => {
                documentsFromDB = dt
            } )
            .catch(error =>{
                console.log(error)
            })
        /* console.log(productsFromDB) */
        return documentsFromDB
    }

    async getDocumentsByID(Model, ID){
        let documentFromDB 
        await Model.findOne({_id: ID})
            .then( dt => {
                documentFromDB = dt
            } )
            .catch(error =>{
                console.log(error)
            })
        /* console.log(productsFromDB) */
        return documentFromDB
    }

    async getPaginate(Model, query ,lmit , pag , srt){
        let documentsFromDB 
        await Model.paginate(query || {} ,{limit: lmit || 10 , page: pag || 1, sort: srt || {}})
            .then( dts => {
                documentsFromDB = dts
            } )
            .catch(error =>{
                console.log(error)
                documentsFromDB = false
            })
        /* console.log(productsFromDB) */
        return documentsFromDB
    }

    async createNewDocument(Model, newProduct){
        
        //Verificamos que el documento sea valido con el esquema(modelo)
        let documentAdded 
        const model = new Model(newProduct)
        await model.save()
            .then( dt => {
                documentAdded = dt
            })
            .catch( error => {
                console.log(error)
                documentAdded = false
            } )
        return documentAdded      
    }

    async createManyDocuments(Model, arrayProducts){
        let documentsAdded
        await Model.insertMany(arrayProducts)
            .then( dts =>{
                documentsAdded = dts
            } )
            .catch( err =>{
                console.log(err)
                documentsAdded = false
            })
        return documentsAdded
    }

    async updateDocument(Model, ID,toUpdate ){
        let documentUpdated
        await Model.updateOne({_id: ID}, toUpdate)
            .then( dt =>{
                /* console.log(dt) */
                //Devolvemos el documento actualizado utilizando el metodo creado "getDocumentByID"
                documentUpdated= this.getDocumentsByID(Model, ID)
            } )
            .catch( err =>{
                console.log(err)
                documentUpdated = false
            })
        return documentUpdated
    }

    async deleteDocument(Model, ID){
        const documentToDelete = this.getDocumentsByID(Model, ID)
        let documentDeleted 
        await Model.deleteOne({_id: ID})
            .then( dt =>{
                documentDeleted = documentToDelete
            } )
            .catch( err => {
                console.log(err)
                documentDeleted= false
            } )
        return documentDeleted
    }

    /**
     * Métodos para el cart  
     **/ 

    //Funcion que agrega un producto en un carrito que ya se encuentre en la DB
    async addProductToCartInDB(Model, IDCart, IDProduct, quantty){
        //Obtenemos el carrito al que se quiere agregar productos
        const cart = await this.getDocumentsByID(Model, IDCart)
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
           const cartUpdated = await this.updateDocument(Model, IDCart, {products: cart.products})
           return cartUpdated
        }
        else{
            return false
        }
    }

    async updateCartInDB(Model, IDCart, newCart){
        const cart = await this.getDocumentsByID(Model, IDCart)
        if (cart){
            const cartUpdated = await this.updateDocument(Model, IDCart, {products: newCart})
            return cartUpdated
        }
        else{
            return false
        }
    }
}

module.exports = ServiceMongo