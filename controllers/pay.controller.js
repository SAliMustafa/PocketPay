const express = require("express");
const User = require("../models/User");
const Card = require("../models/Card");
const Transaction = require("../models/Transaction");
const router = express.Router();

router.get("/:amount/:user", async (req, res) => {
  const { amount, user } = req.params;

  const userDoc = await User.findOne({ username: user });
  if (!userDoc) return res.send("User not found");

  res.render("pay/index.ejs", { amount, user: userDoc });
});

router.post("/payment", async (req, res) => {
  const { amount, userId, cardNumber } = req.body;

  try {
    const userDoc = await User.findById(userId);
    let card = await Card.findOne({ cardNumber: cardNumber });
    if (!card) {
      card = await Card.findOne({ owner: userId });
    }

    if (!card) return res.send("Card not found");

    card.balance += Number(amount);
    await card.save();
    const transactionType = (userDoc && userDoc.username === "skyradar") 
      ? "transfer_in" 
      : "deposit";

    await Transaction.create({
      transactionType: transactionType,
      amount: Number(amount),
      card: card._id,
      counterparty: userId,
      transactionId: Math.floor(100000 + Math.random() * 900000)
    });

    res.redirect(`/card/${card._id}/transaction`);

  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).send("Error processing transaction");
  }
});

module.exports = router;