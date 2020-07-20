const helmet = require('helmet'); /// to avoid web vulnerabilities
const compression = require('compression'); ///to compress http request


module.exports = function(app){
    app.use(helmet());
    app.use(compression());
};