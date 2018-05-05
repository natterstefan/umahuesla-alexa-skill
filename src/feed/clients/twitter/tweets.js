const Twitter = require('twitter');
const FeedEntry = require('../../entity/feedEntry');
const _ = require('lodash');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const fetchTweets = async () => {
  // Docs: https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
  let params = {
    q: '#uh18 -filter:nativeretweets',
    tweet_mode: 'extended', // will return 280 chars, attention: use item.full_text instead of item.text
  };
  let tweets = await client.get('search/tweets.json', params);

  return tweets;
};

const fetchFeed = async () => {
  // Docs: https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/extended-entities-object
  let tweets = await fetchTweets();
  return tweets.statuses.map(tweet => {
    let url = null;
    if (
      tweet.entities &&
      tweet.entities.urls &&
      tweet.entities.urls.lenght > 0
    ) {
      url = tweet.entities.urls[0].url;
    }

    const video = _.find(
      _.get(tweet, 'extended_entities.media', []) || [],
      element => element.type === 'video',
    );
    let videoUrl = null;
    if (video) {
      videoUrl =
        video.video_info.variants[video.video_info.variants.length - 1].url;
    }

    return new FeedEntry(
      tweet.id_str,
      new Date(tweet.created_at),
      tweet.user.name,
      tweet.full_text,
      url,
      videoUrl,
    );
  });
};

module.exports = {
  fetchFeed,
};
