const Ticket = require('../../model/tickets.model.js')
const TicketDTO = require('../../dto/ticket.dto.js')
const BaseService = require('./base.service.js')

class TicketService extends BaseService {
    constructor(){
        super(Ticket)
    }

    async getTicket(code, cartID){
        const CartService = require('./cart.service.js')
        const cartService = new CartService()
        const ticketFound = await this.getByFilter({code: code})
        const cartFound = await cartService.getById(cartID)
        if(!ticketFound || !cartFound){
            return false
        }
        else{
            return ({ticket: ticketFound, cart: cartFound})
        }
    }

    async getTicketByIDCart(idCart){
        return await this.getByFilter({idCart: idCart})
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