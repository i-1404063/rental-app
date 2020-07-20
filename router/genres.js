const ValidateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateMiddleware = require('../middleware/validate');
const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  // throw new Error('Could not get the genres...');

  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post('/', [auth, validateMiddleware(validate)], async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
  });
  await genre.save();
  res.send(genre);
});

router.put('/:id', validateMiddleware(validate), async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );

  if (!genre)
    return res.status(404).send('The genre with the given id was not found...');

  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given id was not found...');

  res.send(genre);
});

router.get('/:id', ValidateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given id was not found...');
  res.send(genre);
});

module.exports = router;
