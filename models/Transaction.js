const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    transactionType:{
        type: String,
        require: true
    },
    amount: {
        type: Number,
        reqiore: true,
        min: 0.1
    },
    transactionId: {
        type: Number,
    },
    counterparty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Transaction = new mongoose.model('Transaction', transactionSchema)
module.exports = Transaction