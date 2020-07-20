const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
  const db = config.get('db');
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => winston.info(`Connected to the ${db}...`));
  //.catch(err => console.error('Could not connect to MongoDB...', err));
};
