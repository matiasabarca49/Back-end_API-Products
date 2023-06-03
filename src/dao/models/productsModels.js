const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true
        },
        description:{},
        price:{
            type: Number,
            required: true
        },
        thumbnail:{
            type: String,
            required: true
        },
        code: {
            type: String,
            unique: true,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        status: {
            type: Boolean,
        },
        category:{
            type: String,
            enum:["Tecnología", "Ropa", "Bazar","Accesorios"]
        }
    }
)

const Product = mongoose.model('products', productSchema)

module.exports = Product