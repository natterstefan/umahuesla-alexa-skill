const alexa = require('alexa-app');
const feed = require('../../../feed/feed');

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

module.exports = app;
