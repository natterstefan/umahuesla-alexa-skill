const tweets = require('./clients/twitter/tweets');

const fetchFeeds = async () => {
  return (await tweets.fetchFeed()).sort((a, b) => b.timestamp - a.timestamp);
};

module.exports = {
  getFeed: fetchFeeds,
};
