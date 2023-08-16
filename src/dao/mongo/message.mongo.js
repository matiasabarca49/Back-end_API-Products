const ServiceMongo = require('../../service/dbMongoService')
const serviceMongo = new ServiceMongo()
const Message = require('../mongo/models/messagesModels.js') 

class MessageManager {
    constructor(){
    }

    getMessage = ()=>{
        return serviceMongo.getDocuments(Message)
    }
}

module.exports = MessageManager
