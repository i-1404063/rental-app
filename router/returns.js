const express = require('express');
const router = express.Router();
const { Rentals } = require('../models/rental');
const { Movies } = require('../models/movie');
const auth = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');
const Joi = require('joi');

router.post(
  '/',
  [auth, validateMiddleware(validateReturn)],
  async (req, res) => {
    const rental = await Rentals.lookup(req.body.customerId, req.body.movieId);
    if (!rental) return res.status(404).send('Rental not Found');

    if (rental.dateReturned)
      return res.status(400).send('Rental is already processed');

    rental.return();
    await rental.save();

    await Movies.update(
      { _id: rental.movie._id },
      { $inc: { numberInStock: 1 } }
    );

    return res.send(rental);
  }
);

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: joi.objectId().required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
