# umahuesla-alexa-skill

## Setup

Install the dependencies with

```
  yarn // or npm install
```

## Start

Start the app (both the Feed Server and the Alexa Server) with `yarn start`.

## Alexa-Skill Setup

Setup the `.env` and add the following keys:

```
## ALEXA SERVER
ALEXA_SERVER_PORT=3000
ALEXA_SERVER_DOMAIN=localhost
```

One can then start the alexa server with `node ./src/alexa/server`
