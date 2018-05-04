const tweets = require('./clients/twitter/tweets');
const tweetsGql = require('./clients/gql/gql');

const getFeed = async () => {
  return (await tweets.fetchFeed()).sort((a, b) => b.timestamp - a.timestamp);
};

const getGqlFeed = async () => {
  return await tweetsGql.fetchFeed();
};

module.exports = {
  getFeed,
  getGqlFeed,
};
