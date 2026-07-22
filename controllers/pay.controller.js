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
  const { amount, userId, flightId, cardNumber } = req.body;

  try {
    const userDoc = await User.findById(userId);

    // Find card by card number or owner ID
    let card = await Card.findOne({ cardNumber: cardNumber });
    if (!card) {
      card = await Card.findOne({ owner: userId });
    }

    if (!card) return res.send("Card not found");

    // Update card balance
    card.balance += Number(amount);
    await card.save();

    // Set transactionType to 'transfer_in' for 'skyradar'
    const transactionType = (userDoc && userDoc.username === "skyradar") 
      ? "transfer_in" 
      : "deposit";

    // Save Transaction
    await Transaction.create({
      transactionType: transactionType,
      amount: Number(amount),
      card: card._id,
      counterparty: userId,
      transactionId: Math.floor(100000 + Math.random() * 900000)
    });

    // Redirect to the success booking route
    res.redirect(`https://skyradar-2oyj.onrender.com/booking/success/${userId}/${flightId}`);

  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).send("Error processing transaction");
  }
});

module.exports = router;