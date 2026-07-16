const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    balance:{
        type: Number,
        require: true
    },
    cardNumber:{
        type: Number,
        min: 1000,
        max: 9999,
        unique: true,
        require: true
    },
    cardType: {
        type: String,
        require: true
    },
    expiryDate: {
        type: String,
        require: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Card = mongoose.model('Card', cardSchema)
module.exports = Card 