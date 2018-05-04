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
    query {
      latestTweets {
        uid
        titleText
        mainText
        updateDate
        streamUrl
        videoUrl
      }
    }
  `;
  const res = await gql(query);
  return _.get(res, 'data.data.latestTweets', []) || [];
};

module.exports = {
  fetchFeed,
};
