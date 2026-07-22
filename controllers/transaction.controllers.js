const Card = require("../models/Card");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const router = require("express").Router({mergeParams: true})
const mongoose = require('mongoose')

router.get('/new-deposit', async (req,res)=>{
    const foundCard = res.locals.card
    res.render('transaction/new-deposit.ejs', {card: foundCard})
})

router.post('/deposit', async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    foundCard.balance = foundCard.balance + Number(req.body.amount)
    await foundCard.save()
    await Transaction.create({
        card: foundCard._id,
        transactionType: 'deposit',
        amount: req.body.amount
    })
    res.redirect(`/card/${foundCard._id}`)
})

router.get('/new-withdrawal', async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    res.render('transaction/withdrawal.ejs', {card: foundCard})
})

router.post('/withdrawal', async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    if(Number(req.body.amount) <= foundCard.balance){
    foundCard.balance = foundCard.balance - Number(req.body.amount)
    await foundCard.save()
    await Transaction.create({
        card: foundCard._id,
        transactionType: 'withdrawal',
        amount: req.body.amount
    })
        res.redirect(`/card/${foundCard._id}`)
    } else {
        res.send('insufficient funds')
    }
})

router.get('/new-transfer', async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    res.render('transaction/new-transfer.ejs', {card: foundCard})
})

router.post('/find-recipient', async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    const recipient = await User.findOne({username: req.body.username})
    if (!recipient){
        return res.send('User not found! try again')
    } 
    const recipientCards = await Card.find({owner: recipient._id})

    if(recipientCards.length === 0){
        return res.send('This user has no cards!')
    }

    res.render('transaction/transfer-confirm.ejs', {
        card: foundCard,
        recipient: recipient,
        recipientCards: recipientCards
    })
}) 

router.post('/confirm-transaction', async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    const amount = Number(req.body.amount)
    const recipientId = req.body.recipientId
    const recipientCardId = req.body.recipientCardId
    if(foundCard.balance >= amount){
        const recipientCard = await Card.findById(recipientCardId)
        foundCard.balance = foundCard.balance - amount
        await foundCard.save()
        recipientCard.balance = recipientCard.balance + amount
        await recipientCard.save()
        const transferId = new mongoose.Types.ObjectId()

        await Transaction.create({
            card: foundCard._id,
            transactionType: 'transfer_out',
            amount: amount,
            counterparty: recipientId,
            transferId: transferId
        })

        await Transaction.create({
            card: recipientCard._id,
            transactionType: 'transfer_in',
            amount: amount,
            counterparty: req.session.user._id,
            transferId: transferId
            
        })
        res.redirect(`/card/${foundCard._id}`)
    } else {
        res.send('insufficient balance')
    }
})
module.exports = router;