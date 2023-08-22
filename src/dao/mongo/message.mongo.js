const ServiceMongo = require('../../service/dbMongoService')
const serviceMongo = new ServiceMongo()
const Message = require('../mongo/models/messagesModels.js') 

class MessageManager {
    constructor(){
    }

    getMessage = ()=>{
        return serviceMongo.getDocuments(Message)
    }

    postMassage = (message) =>{
        return serviceMongo.createNewDocument(Message, message)
    }
}

module.exports = MessageManager
