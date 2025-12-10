const TicketService = require('../service/mongo/ticket.service')
const ticketService = new TicketService()

const getTicket = async (req, res)=>{
    try{
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
    catch(error){
        console.log(error)
        res.status(500).send({status: "Error", message: error.message})
    }
}

const getTicketByIDCart = async (req,res) =>{
    try{
        const {idCart} = req.query
        const ticketGetted = await ticketService.getTicketByIDCart(idCart)
        ticketGetted
            ? res.status(200).send({status:"Success", ticket: ticketGetted})
            : res.status(500).send({status: "ERROR"})
    }
    catch(error){
        console.log(error)
        res.status(500).send({status: "Error", message: error.message})
    }
}

module.exports = {
    getTicket,
    getTicketByIDCart
}