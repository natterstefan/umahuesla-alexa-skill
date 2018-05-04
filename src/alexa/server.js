// import the files
const AlexaAppServer = require('alexa-app-server');
const localtunnel = require('localtunnel');
const dotenv = require('dotenv');

// load environment variables (.env)
dotenv.load();

// create the server and define the environment
const serverPort = process.env.ALEXA_SERVER_PORT || '3000';
const serverDomain = process.env.ALEXA_SERVER_DOMAIN || 'localhost';
const isDevelopment = process.env.NODE_ENV !== 'production';

// setup the sever object
const server = new AlexaAppServer({
  app_dir: 'apps', // Location of alexa-app modules
  app_root: '/alexa/', // Service root
  debug: isDevelopment,
  log: isDevelopment,
  public_html: 'public_html', // Static content
  port: serverPort,
  server_root: __dirname, // Path to root
  verify: !isDevelopment,
});

// start the server
server.start();

// probe status url
server.express.use('/probe_status', function(req, res) {
  res.send('OK');
});

// Start localtunnel as well
if (process.env.LOCALTUNNEL_ENABLED === 'true') {
  const serverPort = process.env.ALEXA_SERVER_PORT || '8000';
  const serverDomain = process.env.LOCALTUNNEL_DOMAIN || 'test3000';
  const tunnel = localtunnel(
    serverPort,
    { subdomain: serverDomain },
    (err, onlineTunnel) => {
      if (err) {
        process.exit();
      }
      console.log(
        `>> Localtunnel: alexa is available at the following URL: ${
          onlineTunnel.url
        }`,
      );
    },
  );

  tunnel.on('close', function() {
    console.log('Localtunnel: alexa is no longer available on the web.');
    process.exit();
  });
}
