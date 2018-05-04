const Hapi = require('hapi');
const localtunnel = require('localtunnel');
const chalk = require('chalk');
const feed = require('../feed/feed');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: process.env.SERVER_PORT || '8000',
});

// Add the route
server.route({
  method: 'GET',
  path: '/',
  handler: function(request, h) {
    return 'OK';
  },
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
  },
});

server.route({
  method: 'GET',
  path: '/feed_with_audio',
  handler: async (request, h) => {
    try {
      const feedItems = (await feed.getFeed()) || [];
      const toVideoBriefingPromise = feedItems.map(
        item => item.toAudioBriefing(), // attention: this is an async method
      );
      return await Promise.all(toVideoBriefingPromise);
    } catch (e) {
      console.error(e);
      return e;
    }
  },
});

server.route({
  method: 'GET',
  path: '/feed_with_video',
  handler: async (request, h) => {
    try {
      const feedItems = (await feed.getFeed()) || [];
      const toVideoBriefingPromise = feedItems.map(
        item => item.toVideoBriefing(), // attention: this is an async method
      );
      return await Promise.all(toVideoBriefingPromise);
    } catch (e) {
      console.error(e);
      return e;
    }
  },
});

// Start the server
async function start() {
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(chalk.green(`>> LOCAL: feed running at: ${server.info.uri}`));
}

// Start localtunnel as well
if (process.env.LOCALTUNNEL_ENABLED === 'true') {
  const serverPort = process.env.SERVER_PORT || '8000';
  const serverDomain = process.env.LOCALTUNNEL_FEED_DOMAIN || undefined;
  const tunnel = localtunnel(
    serverPort,
    { subdomain: serverDomain },
    (err, onlineTunnel) => {
      if (err) {
        process.exit();
      }
      console.log(
        chalk.green(
          `>> WEB: the feed is available at the following URL: ${
            onlineTunnel.url
          }`,
        ),
      );
    },
  );

  tunnel.on('close', function() {
    chalk.red('>> WEB: the feed is no longer available on the web.'),
      process.exit();
  });
}

module.exports = {
  start: start,
};
