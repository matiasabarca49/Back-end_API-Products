class TicketDTO {
    constructor(user, cart){
        const date = new Date()
        this.code = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}/${date.getFullYear()}-${user.id}`
        this.purchase_datetime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        this.amount = cart.reduce( (acumulador, product) => acumulador + product.product.price * product.quantity, 0)
        this.purchaser = user.email
    }
}

module.exports = TicketDTO