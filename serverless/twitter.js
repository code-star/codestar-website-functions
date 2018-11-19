'use strict';

const util = require('./util');
const OAuth = require('oauth');

const { SCREEN_NAME, TWEET_COUNT } = process.env;
const GET_RECENT_TWEETS_URL = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${SCREEN_NAME}&count=${TWEET_COUNT}`;

const authCallback = (callback, headers) => {
  /* params: error, data, result */
  return (error, data) => {
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

// TODO remove hard coded tokens
module.exports.getRecentTweets = (event, context, callback) => {
  const headers = util.safeGetHeaders(event.headers.origin);
  const oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    'tjJCNag24jknOpsk9BTs0Tour',
    'C9aNnCfb9tigjfMk34kknq7Cd9oAtW9TW77m2YJBQxv2smZQ5U',
    '1.0',
    '',
    'HMAC-SHA1'
  );

  oauth.get(
    GET_RECENT_TWEETS_URL,
    '132144715-JB0dtp503oGA0ArDsZ0r4oFsh9GcaQRAvc1Xqyyw',
    '9wCdiAuuzIWFdeAE6gL4hzjV5Rsj1ZLQzyjFC5aKDjHMN',
    authCallback(callback, headers)
  );
};