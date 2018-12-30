'use strict';

const util = require('./util');
const OAuth = require('oauth');

const {
  SCREEN_NAME,
  TWEET_COUNT,
  TWITTER_CONSUMER_KEY,
  TWITTER_APP_SECRET,
  TWITTER_USER_TOKEN,
  TWITTER_USER_SECRET,
} = process.env;
const GET_RECENT_TWEETS_URL = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${SCREEN_NAME}&count=${TWEET_COUNT}`;

const authCallback = (callback, headers) => {
  console.log('authCallback init');
  /* params: error, data, result */
  return (error, data) => {
    console.log('authCallback response', error, data);
    try {
      if (error) {
        console.log(error);
        throw new Error(`Auth failure GET_RECENT_TWEETS_URL ${error}`);
      }
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.log(err);
      callback(`Failed GET_RECENT_TWEETS_URL ${err}`);
    }
  };
};

module.exports.getRecentTweets = (event, context, callback) => {
  const headers = util.safeGetHeaders(event.headers.origin);
  const oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    TWITTER_CONSUMER_KEY, // Twitter application consumer key
    TWITTER_APP_SECRET, // Twitter application secret
    '1.0',
    '',
    'HMAC-SHA1'
  );

  oauth.get(
    GET_RECENT_TWEETS_URL,
    TWITTER_USER_TOKEN, // Twitter user token for this app
    TWITTER_USER_SECRET, // Twitter user secret for this app
    authCallback(callback, headers)
  );
};
