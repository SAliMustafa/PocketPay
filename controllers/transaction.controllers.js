const isSignedIn = require("../middleware/is-signed-in");
const Card = require("../models/Card");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const router = require("express").Router({mergeParams: true})

router.get('/new-deposit', isSignedIn, async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    res.render('transaction/new-deposit.ejs', {card: foundCard})
})

router.post('/deposit', isSignedIn, async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    foundCard.balance = foundCard.balance + Number(req.body.amount)
    await foundCard.save()
    await Transaction.create({
        card: foundCard._id,
        transactionType: 'deposit',
        amount: req.body.amount
    })
    res.redirect('/card')
})

router.get('/new-withdrawal', isSignedIn, async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    res.render('transaction/withdrawal.ejs', {card: foundCard})
})

router.post('/withdrawal', isSignedIn, async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    if(Number(req.body.amount) <= foundCard.balance){
    foundCard.balance = foundCard.balance - Number(req.body.amount)
    await foundCard.save()
    await Transaction.create({
        card: foundCard._id,
        transactionType: 'withdrawal',
        amount: req.body.amount
    })
    } else {
        res.send('insufficient funds')
    }
})

router.get('/new-transfer', isSignedIn, async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    res.render('transaction/new-transfer.ejs', {card: foundCard})
})

router.post('/transfer', isSignedIn, async (req,res)=>{
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
module.exports = router;