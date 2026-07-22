const isSignedIn = require("../middleware/is-signed-in")
const Card = require("../models/Card")
const Transaction = require("../models/Transaction")
const router = require("express").Router()

router.get('/', async (req,res)=>{
    const myCard = await Card.find({ owner: req.session.user._id })
    res.render('card/card.ejs', {card: myCard})
})

router.get('/new', async (req,res)=>{
    res.render('card/new.ejs')
})
router.post('/', async (req,res)=>{
    req.body.owner = req.session.user._id
    const createdCard = await Card.create(req.body)
    res.redirect('/card')
})

router.get('/:cardid', async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    const transactions = await Transaction.find({card: foundCard._id}).sort({createdAt: -1}).populate('counterparty')
    if(foundCard.owner == req.session.user._id){
    res.render('card/card-details.ejs', {card: foundCard, transactions: transactions})
    } else{
        res.send('You dont have access to Card details')
    }
})

router.get('/:cardid/edit', async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    res.render('card/card-edit.ejs', {card: foundCard})
})

router.post('/:cardid/edit', async (req,res)=>{
    const updatedCard = await Card.findByIdAndUpdate(req.params.cardid, req.body)
    res.redirect('/card')
})

router.post('/:cardid/delete', async (req,res)=>{
    const deleteCard = await Card.findByIdAndDelete(req.params.cardid)
    res.redirect('/card')
})

module.exports = router;