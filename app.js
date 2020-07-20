const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')(); //the logging module
require('./startup/routes')(app); //passing app to the routes module
require('./startup/db')(); ///calling mongoose function immediately
require('./startup/config')(); //for jwtPrivateKey
require('./startup/validation')(); //for joi object id
require('./startup/prod')(app); /// production middleware

const port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
