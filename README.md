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

## Start all Node-Services

Start the app (both the Feed Server and the Alexa Server) with `yarn start`.

### Feed

Setup the `.env` and add the following keys:

```
FEED_SERVER_PORT=8000
```

The feed is available at http://localhost:8000/feed. Attention: change the port
accordingly if you have changed `.env`'s values.

Feeds:

* http://localhost:8000/feed
* http://localhost:8000/feed_with_audio
* http://localhost:8000/feed_with_video

## Localtunnel Setup

We use [localtunnel](https://www.npmjs.com/package/localtunnel) to expose the local
alexa and feed server to the world. One can configure the localtunnel Subdomain in
the `.env` file. Otherwise the subdomain will change with every start of the localtunnel.

To setup localtunnel, you need to change the following in `.env`:

```
ALEXA_SERVER_PORT=3000
FEED_SERVER_PORT=8000
LOCALTUNNEL_ENABLED=true
LOCALTUNNEL_FEED_DOMAIN=feed3000
LOCALTUNNEL_ALEXA_DOMAIN=alexa3000
```

The localtunnel url needs to be added as the Alexa-Skill endpoint in the Alexa Skill
settings.

## Twitter Feed Setup

Setup the `.env` and add the following keys:

```
## TWITTER
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN_KEY=
TWITTER_ACCESS_TOKEN_SECRET=
```

One can then start the feed server with `yarn run start:server`.

## Alexa-Skill Setup

Setup the `.env` and add the following keys:

```
## ALEXA SERVER
ALEXA_SERVER_PORT=3000
ALEXA_SERVER_DOMAIN=localhost
```

One can then start the alexa server with `yarn start:alexa`

### Intents and Utterances

Just start the Alexa server and open http://localhost:3000/alexa/umahuesla.
The intents and utterances are at the bottom of the test-pages.
