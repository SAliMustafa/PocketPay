const isSignedIn = require("../middleware/is-signed-in")
const Card = require("../models/Card")
const router = require("express").Router()

router.get('/', isSignedIn, async (req,res)=>{
    console.log(req.session)
    const myCard = await Card.find({ owner: req.session.user._id })
    console.log(myCard)
    res.render('card/card.ejs', {card: myCard})
})

router.get('/new', isSignedIn, async (req,res)=>{
    res.render('card/new.ejs')
})
router.post('/', isSignedIn, async (req,res)=>{
    req.body.owner = req.session.user._id
    const createdCard = await Card.create(req.body)
    res.redirect('/card')
})

router.get('/:cardid', isSignedIn, async (req,res)=>{
    const foundCard = await Card.findById(req.params.cardid)
    if(foundCard.owner == req.session.user._id){
    res.render('card/card-details.ejs', {card: foundCard})
    } else{
        res.send('You dont have access to Card details')
    }
})

module.exports = router;