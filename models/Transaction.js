const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    transactionType:{
        type: String,
        required: true,
        enum: ['deposit', 'withdrawal', 'transfer_out', 'transfer_in']
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    transactionId: {
        type: Number,
    },
    transferId: {
        type: String
    },
    counterparty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
        required: true
    }
}, {timestamps: true})

const Transaction = new mongoose.model('Transaction', transactionSchema)
module.exports = Transaction