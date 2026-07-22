const express = require("express");
const User = require("../models/User");
const Card = require("../models/Card");
const Transaction = require("../models/Transaction");
const router = express.Router();

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

router.post("/payment", async (req, res) => {
  const { amount, username, userId, flightId } = req.body;

  try {
    const userDoc = await User.findOne({ username: username });

    let card;
    if (userDoc) {
      card = await Card.findOne({ owner: userDoc._id });
    }
    if (!card) {
      card = await Card.findOne();
    }

    if (!card) return res.send("No card found in database");

    card.balance += Number(amount);
    await card.save();

    const transactionType = (username === "skyradar") 
      ? "transfer_in" 
      : "deposit";

    await Transaction.create({
      transactionType: transactionType,
      amount: Number(amount),
      card: card._id,
      counterparty: userDoc ? userDoc._id : null, // Links transaction to the user
      transactionId: Math.floor(100000 + Math.random() * 900000)
    });

    res.redirect(`https://skyradar-2oyj.onrender.com/booking/success/${userId}/${flightId}`);

  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send("Error processing transaction");
  }
});

module.exports = router;