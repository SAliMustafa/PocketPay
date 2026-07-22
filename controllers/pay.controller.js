const express = require("express");
const User = require("../models/User");
const Card = require("../models/Card");
const Transaction = require("../models/Transaction");
const router = express.Router();

// 1. Render payment page: GET /pay/:amount/:user/:userId/:flightId
router.get("/:amount/:user/:userId/:flightId", async (req, res) => {
  const { amount, user, userId, flightId } = req.params;

  const userDoc = await User.findOne({ username: user });
  if (!userDoc) return res.send("User not found");

  res.render("pay/index.ejs", { 
    amount, 
    user: userDoc, 
    userId, 
    flightId 
  });
});

// 2. Process payment & save transaction: POST /pay/payment
router.post("/payment", async (req, res) => {
  const { amount, username, userId, flightId } = req.body;

  try {
    // Grab the available card in the database
    const card = await Card.findOne();
    if (!card) return res.send("No card found in database");

    // Update card balance
    card.balance += Number(amount);
    await card.save();

    // Static check on username passed from form
    const transactionType = (username === "skyradar") 
      ? "transfer_in" 
      : "deposit";

    // Save Transaction
    await Transaction.create({
      transactionType: transactionType,
      amount: Number(amount),
      card: card._id,
      transactionId: Math.floor(100000 + Math.random() * 900000)
    });

    // Pass-through redirect using userId and flightId
    res.redirect(`https://skyradar-2oyj.onrender.com/booking/success/${userId}/${flightId}`);

  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send("Error processing transaction");
  }
});

module.exports = router;