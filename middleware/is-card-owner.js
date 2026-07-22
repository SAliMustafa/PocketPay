const Card = require('../models/Card')
const isCardOwner = async (req, res, next) => {
    const card = await Card.findById(req.params.cardid)
    res.locals.card = card
  if (req.session.user._id.toString() === card.owner.toString()) return  next();
  res.redirect("/card");
};

module.exports = isCardOwner;