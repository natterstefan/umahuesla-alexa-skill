const tweets = require('./clients/twitter/tweets');

const fetchFeeds = async () => {
    return (await tweets.fetchFeed())
        .sort((a, b) => {
            return a.timestamp - b.timestamp;
        });
};

module.exports = {
    getFeed: fetchFeeds
};