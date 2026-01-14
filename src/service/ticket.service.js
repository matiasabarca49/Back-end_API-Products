const Ticket = require('../model/tickets.model.js')
const TicketDTO = require('../dto/ticket.dto.js')
const BaseService = require('./base.service.js')
const MongoRepository = require('../repositories/implementations/mongoRepository.js')

class TicketService extends BaseService {
    constructor(){
        const mongoRepository = new MongoRepository(Ticket)
        super(mongoRepository)
    }

    async findTicket(code, cartID){
        const CartService = require('./cart.service.js')

        const cartService = new CartService()
        const ticketFound = await this.findByFilter({code: code})
        const cartFound = await cartService.findById(cartID)
        if(!ticketFound || !cartFound){
            return false
        }
        else{
            return ({ticket: ticketFound, cart: cartFound})
        }
    }

    async findTicketByIDCart(idCart){
        return await this.findByFilter({idCart: idCart})
    }

     /**
     * 
     *Wrapper Pattern
        */

    toFormatDTO(ticketData) {
        return new TicketDTO(ticketData)
    }

    toDTO(ticketData) {
        return TicketDTO.toResponse(ticketData) 
    }

    toManyDTO(tickets) {
        return tickets.map(ticket => TicketDTO.toResponse(ticket)) 
    }

}

module.exports = TicketService