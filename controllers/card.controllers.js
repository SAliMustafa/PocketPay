const isSignedIn = require("../middleware/is-signed-in")
const Card = require("../models/Card")

const router = require("express").Router()

router.get('/', isSignedIn, async (req,res)=>{
    console.log(req.session)
    const myCard = await Card.find({ owner: req.session.user._id })
    console.log(myCard)
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
    res.render('card/card-details.ejs', {card: foundCard})
})

module.exports = router;