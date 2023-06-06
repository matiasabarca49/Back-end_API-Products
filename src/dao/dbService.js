class ServiceMongo{

    constructor(){

    }

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
        await Model.findById(ID)
            .then( dt => {
                documentFromDB = dt
            } )
            .catch(error =>{
                console.log(error)
            })
        /* console.log(productsFromDB) */
        return documentFromDB
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
                console.log(dt)
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

    async addProductToCartInDB(Model, IDCart, IDProduct){
        const cart = await this.getDocumentsByID(Model, IDCart)
        if (cart){
            const productFound = cart.products.find( item => item.product === IDProduct )
            productFound
                ? productFound.quantity++
                : cart.products = [...cart.products, {product: IDProduct, quantity: 1}]
           const cartUpdated = await this.updateDocument(Model, IDCart, {products: cart.products})
           return cartUpdated
        }
        else{
            return false
        }
    }
}

module.exports = ServiceMongo