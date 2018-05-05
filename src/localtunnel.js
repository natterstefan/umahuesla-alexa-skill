const chalk = require('chalk');
const localtunnel = require('localtunnel');
const dotenv = require('dotenv');

// load environment variables (.env)
dotenv.load();

const startFeedLocaltunnel = () => {
  if (process.env.LOCALTUNNEL_ENABLED === 'true') {
    const serverPort = process.env.FEED_SERVER_PORT || '8000';
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
            `>> WEB: feed is available at the following URL: ${
              onlineTunnel.url
            }`,
          ),
        );
      },
    );

    tunnel.on('close', function() {
      chalk.red('>> WEB: feed is no longer available on the web.'),
        process.exit();
    });
  }
};

const startAlexaFeedLocaltunnel = () => {
  if (process.env.LOCALTUNNEL_ENABLED === 'true') {
    const serverPort = process.env.ALEXA_SERVER_PORT || '8000';
    const serverDomain = process.env.LOCALTUNNEL_ALEXA_DOMAIN || undefined;
    const tunnel = localtunnel(
      serverPort,
      { subdomain: serverDomain },
      (err, onlineTunnel) => {
        if (err) {
          process.exit();
        }
        console.log(
          chalk.blue(
            `>> WEB: alexa is available at the following URL: ${
              onlineTunnel.url
            }`,
          ),
        );
      },
    );

    tunnel.on('close', function() {
      console.log(
        chalk.red('>> WEB: alexa is no longer available on the web.'),
      );
      process.exit();
    });
  }
};

const startPythonLocaltunnel = () => {
  if (process.env.LOCALTUNNEL_ENABLED === 'true') {
    const serverPort = '9090'; // hardcoded in the python part as well
    const serverDomain = process.env.LOCALTUNNEL_GQL_DOMAIN || undefined;
    const tunnel = localtunnel(
      serverPort,
      { subdomain: serverDomain },
      (err, onlineTunnel) => {
        if (err) {
          process.exit();
        }
        console.log(
          chalk.magenta(
            `>> WEB: gql is available at the following URL: ${
              onlineTunnel.url
            }`,
          ),
        );
      },
    );

    tunnel.on('close', function() {
      console.log(
        chalk.magenta('>> WEB: gql is no longer available on the web.'),
      );
      process.exit();
    });
  }
};

const start = () => {
  console.log(chalk.bgGreen('>> START SERVERS <<'));
  startFeedLocaltunnel();
  startAlexaFeedLocaltunnel();
  startPythonLocaltunnel();
};

start();
