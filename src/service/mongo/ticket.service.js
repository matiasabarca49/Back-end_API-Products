const Cart = require('../../model/cartsModels.js')
const Ticket = require('../../model/ticketsModels.js')
const PersistController = require('../../dao/mongo/persistController.js')
const persistController = new PersistController()

class TicketService{
    constructor(){

    }

    async getTicket(code, cartID){
        const ticketFound = await persistController.getDocumentsByFilter(Ticket, {code: code})
        const cartFound = await persistController.getDocumentsByID(Cart, cartID)
        if(!ticketFound || !cartFound){
            return false
        }
        else{
            return ({ticket: ticketFound, cart: cartFound})
        }
    }


}

module.exports = TicketService