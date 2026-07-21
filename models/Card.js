const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    balance:{
        type: Number,
        default: 0

    },
    cardNumber:{
        type: String,
        maxLength: 9999,
        require: true
    },
    cardType: {
        type: String,
        require: true,
        enum: ['debit', 'credit']
    },
    expiryDate: {
        type: String,
        require: true
    },
    nickname: {
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