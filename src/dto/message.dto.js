class MessageDTO{
    constructor(message){
        this.id = message.id
        this.autor = message.autor
        this.text = message.text
        this.dateMessage = message.dateMessage
    }

    static toResponse(message){
        return {
            id: message._id,
            autor: message.autor,
            text: message.text,
            dateMessage: message.dateMessage
        }
    }
}

module.exports = MessageDTO