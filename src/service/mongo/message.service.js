const PersistController = require('../../dao/mongo/persistController.js')
const persistController = new PersistController()
const Message = require('../../model/messages.model.js') 

class MessageService {
    constructor(){
    }

    getMessage = ()=>{
        return persistController.getDocuments(Message)
    }

    postMassage = (message) =>{
        return persistController.createNewDocument(Message, message)
    }
}

module.exports = MessageService
