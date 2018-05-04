const alexa = require('alexa-app');
const feed = require('../../../feed/feed');
const _ = require('lodash');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
const app = new alexa.app('umahuesla');
app.id = require('./package.json').alexa.applicationId;

app.launch(function(req, res) {
  res.say('Hallo.');
});

app.intent(
  'FeedIntent',
  {
    utterances: ['sag mir was es neues gibt|was gib es neues?'],
  },
  async (req, res) => {
    try {
      const items = (await feed.getFeed()).map(feed => feed.toSkill());
      const text = items
        .map(tweet => `${tweet.titleText}: ${tweet.mainText}.`)
        .slice(0, 2)
        .join('. ');
      res.say(`Hier sind deine Updates. ${text}`);
    } catch (e) {
      console.error('An error occured >>', e); /* eslint-disable-line */
      res.say('Etwas lief schief. Bitte versuche es später erneut.');
    }
  },
);

app.intent(
  'FeedIntent',
  {
    utterances: ['sag mir was es neues gibt|was gib es neues?'],
  },
  async (req, res) => {
    try {
      const items = (await feed.getFeed()).map(feed => feed.toSkill());
      const text = items
        .map(tweet => `${tweet.titleText}: ${tweet.mainText}.`)
        .slice(0, 3)
        .join('. ');

      res.say(`Hier sind die letzten drei Tweets. ${text}`);
    } catch (e) {
      console.error('An error occured >>', e); /* eslint-disable-line */
      res.say('Etwas lief schief. Bitte versuche es später erneut.');
    }
  },
);

app.intent(
  'TopVideoIntent',
  {
    utterances: ['zeig mir ein video'],
  },
  async (req, res) => {
    // https://stackoverflow.com/a/47087403/1238150
    const canPlayVideo =
      true || req.context.System.device.supportedInterfaces.videoApp;

    try {
      const items = (await feed.getFeed()).map(feed => feed.toVideoSkill());
      const video = _.find(items, item => !!item.videoUrl);

      if (video && canPlayVideo) {
        res.say('Gib mir eine Sekunde. Ich lade ein Video für dich.');

        // https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html#card-object
        res.card({
          type: 'Standard',
          title: video.titleText, // this is not required for type Simple or Standard
          text: video.mainText,
          image: {
            // image is optional
            smallImageUrl:
              'https://media.giphy.com/media/o5oLImoQgGsKY/giphy.gif', // required
            largeImageUrl:
              'https://media.giphy.com/media/o5oLImoQgGsKY/giphy.gif',
          },
        });
        // https://developer.amazon.com/docs/custom-skills/videoapp-interface-reference.html
        const videoDirective = {
          type: 'VideoApp.Launch',
          videoItem: {
            source: video.videoUrl,
            metadata: {
              title: video.mainText,
              subtitle: video.mainText,
            },
          },
        };
        res.directive(videoDirective);
        // set shouldEndSession to null/false, se
        // - https://github.com/timheuer/alexa-skills-dotnet/issues/41#issuecomment-353660704
        // - https://stackoverflow.com/a/46305074/1238150
        // Example: https://github.com/agilityfeat/video-streaming-alexa-skill/blob/688ec26c07860fd9f8713e637baab86b2a41b3a0/index.js#L511-L541
        res
          .say(null)
          .shouldEndSession(null)
          .send();
      } else {
        if (!canPlayVideo) {
          res.say(
            `Dein Gerät kann kein Video abspielen. Ich lese dir stattdessen den Tweet vor. ${
              video.mainText
            }`,
          );
          return;
        }

        res.say('Tut mir Leid, aber ich habe kein Video gefunden.');
      }
    } catch (e) {
      console.error('An error occured >>', e); /* eslint-disable-line */
      res.say('Etwas lief schief. Bitte versuche es später erneut.');
    }
  },
);

module.exports = app;
