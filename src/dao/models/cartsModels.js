const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    dateCart:{
        type: String,
        required: true
    },
    products:{
        type: Array,
        required: true
    }
})

const Cart = mongoose.model("carts", cartSchema)
module.exports = Cart