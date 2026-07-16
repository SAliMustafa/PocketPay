const Card = require("../models/Card")

const router = require("express").Router()

router.get('/', async (req,res)=>{
    res.render('card/card.ejs')
})

router.get('/new', async (req,res)=>{
    res.render('card/new.ejs')
})
router.post('/', async (req,res)=>{
    console.log(req.body)
    const createdCard = await Card.create(req.body)
    res.redirect('/card')
})

module.exports = router;
