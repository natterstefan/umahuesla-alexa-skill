const Twitter = require('twitter');
const FeedEntry = require('../../entity/feedEntry');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const fetchTweets = async () => {
  let params = {
    q: '#uh18 -filter:nativeretweets',
  };
  let tweets = await client.get('search/tweets.json', params);

  return tweets;
};

const fetchFeed = async () => {
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

    return new FeedEntry(
      tweet.id_str,
      new Date(tweet.created_at),
      `Tweet von ${tweet.user.name}`,
      tweet.text,
      url,
    );
  });
};

module.exports = {
  fetchFeed: fetchFeed,
};
