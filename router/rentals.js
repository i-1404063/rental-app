const auth = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');
const { Rentals, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movies } = require('../models/movie');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rentals.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', [auth, validateMiddleware(validate)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send('Invalid Customer...');

  const movie = await Movies.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid Movie...');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock...');

  let rental = new Rentals({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update(
        'movies',
        {
          _id: movie._id,
        },
        {
          $inc: {
            numberInStock: -1,
          },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send('Something failed...');
  }
});

module.exports = router;
