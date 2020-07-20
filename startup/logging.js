const winston = require('winston');
// require('winston-mongodb'); /// storing log in the mongodb
require('express-async-errors'); ///for async errors

module.exports = function () {
  //this is only for the synchronus code but we have to handle promise rejection in different way
  // process.on('uncaughtException', ex => {
  //   console.log('WE GOT AN UNCAUGHT EXCEPTION.');
  //   winston.error(ex.message, ex);
  // });
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  //for the unhandled promise rejection
  process.on('unhandledRejection', ex => {
    // console.log('WE GON AN UNHANDLED REJECTION.');
    // winston.error(ex.message, ex);
    throw ex;
  });

  //logging error which occurs during the request processing pipeline or express process
  winston.add(winston.transports.File, { filename: 'logfile.log' });
  // winston.add(winston.transports.MongoDB, {
  //   db: 'mongodb://localhost/vidly',
  //   level: 'error',
  // });

  //when error occurs outiside of the request processing pipeline
  // throw new Error('Something failed during startup..');

  //unhandle promise rejection
  // const p = Promise.reject('Something failed miserably.');
  // p.then(() => console.log('Done'));
};
