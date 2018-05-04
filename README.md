# umahuesla-alexa-skill

## Setup

Install the dependencies with

```
  yarn // or npm install
```

## Start all Node-Services

Start the app (both the Feed Server and the Alexa Server) with `yarn start`.

### Feed

The feed is available at http://localhost:4000/feed. Attention: change the port
accordingly if you have changed `.env`'s values.

Feeds:

* http://localhost:4000/feed
* http://localhost:4000/feed_with_audio
* http://localhost:4000/feed_with_video

## Twitter Feed Setup

Setup the `.env` and add the following keys:

```
## TWITTER
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN_KEY=
TWITTER_ACCESS_TOKEN_SECRET=
```

One can then start the feed server with `yarn run start:server`

## Alexa-Skill Setup

Setup the `.env` and add the following keys:

```
## ALEXA SERVER
ALEXA_SERVER_PORT=3000
ALEXA_SERVER_DOMAIN=localhost
```

One can then start the alexa server with `yarn start:alexa`
