# umahüsla 2018 - Alexa Skill

[![umahüsla 2018 badge](https://img.shields.io/badge/umah%C3%BCsla%202018-hackathon-brightgreen.svg)](https://uh18.diin.io/)
[![Dependencies](https://img.shields.io/david/natterstefan/umahuesla-alexa-skill.svg)](https://github.com/natterstefan/umahuesla-alexa-skill/blob/master/package.json)
[![DevDependencies](https://img.shields.io/david/dev/natterstefan/umahuesla-alexa-skill.svg)](https://github.com/natterstefan/umahuesla-alexa-skill/blob/master/package.json)
[![GitHub license](https://img.shields.io/github/license/natterstefan/umahuesla-alexa-skill.svg)](https://github.com/natterstefan/umahuesla-alexa-skill/blob/master/LICENCE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/natterstefan/umahuesla-alexa-skill.svg?style=social)](https://twitter.com/intent/tweet?text=https://github.com/natterstefan/umahuesla-alexa-skill%20%23uh18)

## Setup

Install the dependencies with

```
  yarn // or npm install
```

## Start all Services

Once you have followed the setup guides below, you can start the app.

* Node: Start the app (both the Feed Server and the Alexa Server) with `yarn start`.
* Python (gql): start the gql server with `docker-compose up` and `v/bin/server`
* (Optional): Expose the services to the world with `yarn start:public`, you then
  do not need to run `yarn start` first.

## Start all services with pm2

One can use pm2 to start the node services and keep them running (eg. with auto
restart). Some important pm2 commands are listed below:

```
pm2 start pm2.config.js // starts all node services
pm2 stop pm2.config.js // stops all node services
pm2 kill // will kill all processes
pm2 log // see http://pm2.keymetrics.io/docs/usage/log-management/
```

You can then omit `yarn start` and `yarn start:public`.

## Setup

### Localtunnel Setup

We use [localtunnel](https://www.npmjs.com/package/localtunnel) to expose the local
alexa and feed server to the world. One can configure the localtunnel Subdomain in
the `.env` file. Otherwise the subdomain will change with every start of the localtunnel.

To setup localtunnel, you need to change the following in `.env`:

```
## Ports
ALEXA_SERVER_PORT=3000
FEED_SERVER_PORT=8000

## LOCALTUNNEL
LOCALTUNNEL_ENABLED=true
LOCALTUNNEL_FEED_DOMAIN=feed3000
LOCALTUNNEL_ALEXA_DOMAIN=alexa3000
LOCALTUNNEL_GQL_DOMAIN=gql3000
```

The localtunnel url needs to be added as the Alexa-Skill endpoint in the Alexa Skill
settings.

### GQL Server Setup (node)

Add the following to the `.env`:

```
## PYTHON SERVER
GQL_SERVER=http://localhost:9090/gql
```

The port must match with the gql python server port.

### Feed & Twitter Setup

Setup the `.env` and add the following keys to setup twitter and the feed server:

```
## TWITTER
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN_KEY=
TWITTER_ACCESS_TOKEN_SECRET=

FEED_SERVER_PORT=8000
```

One can then start the feed server with `yarn start:server`. The feed is then
available at http://localhost:8000/feed.

Available feeds:

* http://localhost:8000/feed
* http://localhost:8000/feed_with_audio
* http://localhost:8000/feed_with_video
* http://localhost:8000/feed_gql (only works when the python server runs as well)

### Alexa-Skill Setup

Setup the `.env` and add the following keys:

```
## ALEXA SERVER
ALEXA_SERVER_PORT=3000
ALEXA_SERVER_DOMAIN=localhost
```

One can then start the alexa server with `yarn start:alexa`

#### Setup Video Skill

* https://developer.amazon.com/docs/custom-skills/videoapp-interface-reference.html#configure-your-skill-for-the-videoapp-directives

#### Intents and Utterances

Just start the Alexa server and open http://localhost:3000/alexa/umahuesla.
The intents and utterances are at the bottom of the test-pages.

### Python App Quick Guide

Local environment:

Run `./gradlew dev`

Start Crate with `docker-compose up -d`.

Init DB Tables with `v/bin/init_db`.

Configure Env VARS (evertime or put it into `.bash_profile`):

```
export UH_TWITTER_API_CONSUMER_KEY=...
export UH_TWITTER_API_CONSUMER_SECRET=...
export UH_TWITTER_API_ACCESS_TOKEN_KEY=...
export UH_TWITTER_API_ACCESS_TOKEN_SECRET=...
```

Expose the GQL to the world by running `yarn start:public` (Note: this will also
expose the other services). Optionally you can set the subdomain by adding
`yarn start:python --subdomain test123`. This will result in (if subdomain is
available): https://test123.localtunnel.me

Once the localtunnel is ready export another Env variable with the given
localtunnel url. Set it with every start or put it into `.bash_profile` as well.

```
export UH_GQL_SERVER=...
```

Example: `export UH_GQL_SERVER="https://gql-magic-3000.localtunnel.me/"`

Now, start server with `v/bin/server`. Fetches new tweets every 2 minutes (latest 15
tweets as long as running).

Server exposes on `http:/localhost:9090/gqlui` and on the localtunnel url. The
crate console is available at `http://localhost:4200/#/`.
