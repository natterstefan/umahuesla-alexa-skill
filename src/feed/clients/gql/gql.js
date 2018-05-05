const axios = require('axios');
const dotenv = require('dotenv');
const _ = require('lodash');

// load environment variables (.env)
dotenv.load();

const gql = (query, variables) => {
  // ATTENTION: the python gql server must run already!
  return axios.request({
    method: 'POST',
    url: process.env.GQL_SERVER,
    data: {
      query: query,
      variables: variables,
    },
  });
};

const fetchFeed = async () => {
  const query = `
    query ($hashtag: String) {
      latestTweets (hashtag: $hashtag){
        uid
        titleText
        mainText
        updateDate
        streamUrl
        videoUrl
      }
    }
  `;

  const variables = {
    hashtag: 'uh18',
  };

  const res = await gql(query, variables);
  return _.get(res, 'data.data.latestTweets', []) || [];
};

module.exports = {
  fetchFeed,
};
