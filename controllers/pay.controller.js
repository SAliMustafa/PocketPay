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
    // 1. Find the target user in MongoDB to get their actual _id
    const userDoc = await User.findOne({ username: username });

    // 2. Find the card belonging to this user (fallback to any card if not linked)
    let card;
    if (userDoc) {
      card = await Card.findOne({ owner: userDoc._id });
    }
    if (!card) {
      card = await Card.findOne();
    }

    if (!card) return res.send("No card found in database");

    // 3. Update card balance
    card.balance += Number(amount);
    await card.save();

    // 4. Set transactionType
    const transactionType = (username === "skyradar") 
      ? "transfer_in" 
      : "deposit";

    // 5. Save Transaction WITH counterparty and the user's card ID
    await Transaction.create({
      transactionType: transactionType,
      amount: Number(amount),
      card: card._id,
      counterparty: userDoc ? userDoc._id : null, // Links transaction to the user
      transactionId: Math.floor(100000 + Math.random() * 900000)
    });

    // 6. Redirect to external success page
    res.redirect(`https://skyradar-2oyj.onrender.com/booking/success/${userId}/${flightId}`);

  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send("Error processing transaction");
  }
});

module.exports = router;