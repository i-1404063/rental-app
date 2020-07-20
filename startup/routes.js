const express = require('express');
const genres = require('../router/genres');
const customers = require('../router/customers');
const movies = require('../router/movies');
const rentals = require('../router/rentals');
const users = require('../router/users');
const auth = require('../router/auth');
const error = require('../middleware/error');
const returns = require('../router/returns');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/auth', auth); //authetication for an user
  app.use('/api/users', users); //registering for an user
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/returns', returns);
  app.use(error); ///log the error
};
