const PersistController = require('../../dao/mongo/persistController.js')

class BaseService{

    constructor(model) {  
        this.model = model
        this.persistController = new PersistController()
    }

    async getAll(){
        const documents = await this.persistController.getDocuments(this.model)
        if(!documents || documents.length === 0) return []
        // Buscar si la clase hija definió toDTO
        //Wrapper Pattern
        return this.toManyDTO ? this.toManyDTO(documents) : documents
    }

    async getByFilter(filter){
        const document = await this.persistController.getDocumentsByFilter(this.model, filter)
        if(!document || document.length === 0) return null
        // Buscar si la clase hija definió toDTO
        return this.toDTO ? this.toDTO(document) : document
    }

    //Uso interno
    async getRawByFilter(filter){
        const document = await this.persistController.getDocumentsByFilter(this.model, filter)
        if(!document || document.length === 0) return null
        // Buscar si la clase hija definió toDTO
        return document
    }

    async getByFilter(filter){
        const document = await this.persistController.getDocumentsByFilter(this.model, filter)
        if(!document || document.length === 0) return null
        // Buscar si la clase hija definió toDTO
        return this.toDTO ? this.toDTO(document) : document
    }

    async getById(id){
        const document = await this.persistController.getDocumentsByID(this.model, id)
        if(!document || document.length === 0) return null
        // Buscar si la clase hija definió toDTO
        return this.toDTO ? this.toDTO(document) : document
    }

    async create(document){
        //Formateamos el documento si la clase hija definió toFormatDTO
        const documentCreated = await this.persistController.createNewDocument(this.model, this.toFormatDTO ? this.toFormatDTO(document) : document)

        //Si se produjo un error al crear el documento, lanzamos una excepción
        if (!documentCreated){ 
            throw new Error('Error al crear el documento')
        }
        // Buscar si la clase hija definió toDTO
        return this.toDTO ? this.toDTO(documentCreated) : documentCreated
    }

    async update(id, updatedDocument){
        return await this.persistController.updateDocument(this.model, id, updatedDocument)
    }

    async delete(id){
        return await this.persistController.deleteDocument(this.model, id)
    }
}

module.exports = { BaseService }