'use strict';

const Hapi = require('hapi');
const feed = require('../feed/feed');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, h) {

        return 'hello world';
    }
});

server.route({
    method: 'GET',
    path: '/feed',
    handler: async (request, h) => {
        try {
            return (await feed.getFeed()).map(feed => feed.toBriefing());
        } catch (e) {
            console.error(e);
            return e;
        }
    }
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

module.exports = {
    start: start
};