const isSignedIn = require("../middleware/is-signed-in")
const router = require("express").Router()
const Card = require("../models/Card")
const Transaction = require("../models/Transaction")

router.get('/', isSignedIn, async (req, res) => {
    // 1. Get all of the user's cards
    const cards = await Card.find({ owner: req.session.user._id })

    // 2. Compute total balance by summing each card's balance
    const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0)

    // 3. Get the IDs of all those cards (needed to find their transactions)
    const cardIds = cards.map(card => card._id)

    // 4. Find recent transactions across all those cards, newest first, limit 5
    const recentTransactions = await Transaction.find({ card: { $in: cardIds } })
        .sort({ createdAt: -1 })
        .limit(5)

    // 5. Render, passing everything the view needs
    res.render('homepage.ejs', {
        user: req.session.user,
        cards: cards,
        totalBalance: totalBalance,
        recentTransactions: recentTransactions
    })
})
module.exports = router;
