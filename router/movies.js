const auth = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');
const { Genre } = require('../models/genre');
const { Movies, validate } = require('../models/movie');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movies.find().select('title');
  res.send(movies);
});

router.post('/', [auth, validateMiddleware(validate)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre...');

  const movie = new Movies({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  });
  await movie.save();
  res.send(movie);
});

module.exports = router;
