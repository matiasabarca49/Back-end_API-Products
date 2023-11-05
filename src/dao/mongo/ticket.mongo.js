const Cart = require('./models/cartsModels.js')
const Ticket = require('./models/ticketsModels.js')
const ServiceMongo = require('../../service/dbMongoService.js')
const serviceMongo = new ServiceMongo()

class TicketManager{
    constructor(){

    }

    async getTicket(code, cartID){
        const ticketFound = await serviceMongo.getDocumentsByFilter(Ticket, {code: code})
        const cartFound = await serviceMongo.getDocumentsByID(Cart, cartID)
        if(!ticketFound || !cartFound){
            return false
        }
        else{
            return ({ticket: ticketFound, cart: cartFound})
        }
    }


}

module.exports = TicketManager