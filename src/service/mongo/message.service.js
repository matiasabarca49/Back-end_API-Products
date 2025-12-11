const PersistController = require('../../dao/mongo/persistController.js')
const MessageDTO = require('../../dto/message.dto.js')
const persistController = new PersistController()
const Message = require('../../model/messages.model.js') 
const BaseService = require('./base.service.js')

class MessageService extends BaseService {
    constructor(){
        super(Message)
    }

    /**
     * Wrapper Pattern
     */

    toFormatDTO(messageData) {
        return new MessageDTO(messageData)
    }
    
    toDTO(message) {
        return MessageDTO.toResponse(message) 
    }

    toManyDTO(messages) {
        return messages.map(message => MessageDTO.toResponse(message))  
    }

}

module.exports = MessageService
