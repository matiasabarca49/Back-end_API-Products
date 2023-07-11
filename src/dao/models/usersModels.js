const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: false
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol:{
        type: String,
        enum:["User","Admin"],
        required: true
    }
})

const User = mongoose.model("users", userSchema)

module.exports = User