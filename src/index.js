require('dotenv').config();

// starts the server which makes the feed public available for Alexa/Amazon
const server = require('./server/server');
server.start();
