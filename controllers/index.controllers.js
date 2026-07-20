const isSignedIn = require("../middleware/is-signed-in")
const router = require("express").Router()
const Card = require("../models/Card")
const Transaction = require("../models/Transaction")

router.get('/', isSignedIn, async (req, res) => {
    const cards = await Card.find({ owner: req.session.user._id })
    let totalBalance = 0
    for (let card of cards){
        totalBalance += card.balance
    }
    const cardIds = cards.map(card => card._id)

    const recentTransactions = await Transaction.find({ card: { $in: cardIds } }).sort({ createdAt: -1 }).limit(5).populate('counterparty')

    res.render('homepage.ejs', {
        user: req.session.user,
        cards: cards,
        totalBalance: totalBalance,
        recentTransactions: recentTransactions
    })
})
module.exports = router;
