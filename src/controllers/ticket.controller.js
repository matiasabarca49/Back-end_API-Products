const TicketService = require('../service/mongo/ticket.service')
const ticketService = new TicketService()

const getTicket = async (req, res)=>{
    const { code, cart } = req.query
    const ticket = await ticketService.getTicket(code, cart)
    if(ticket){
        ticket.user = { 
            name :req.session.user,
            lastName : req.session.lastName
        }
        res.status(200).send({status: "Successful", ticket: ticket.ticket, cart: ticket.cart, user: ticket.user})
    }
    else{
        res.status(500).send({status: "Error"})
    }
}

module.exports = {
    getTicket
}