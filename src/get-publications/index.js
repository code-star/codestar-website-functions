'use strict';

// Use `got` instead of using `https` (intransparent syntax) or `request-promise` (bloated)
const got = require('got');
const parser = require('fast-xml-parser');
const util = require('../util');

const GET_PUBLICATIONS_URL = 'https://medium.com/feed/codestar-blog';

/**
 * @description Lambda function getPublications
 *
 * Method: GET
 *
 * Validates the origin URL with {@link safeGetHeaders}
 *
 * Endpoints
 * - on test stage: https://hjoutysc5k.execute-api.eu-west-1.amazonaws.com/test/get-publications
 * - on prod stage: https://267sder6c7.execute-api.eu-west-1.amazonaws.com/prod/get-publications
 *
 * @param {object} event AWS event
 * @param {object} context AWS context
 * @param {function} callback AWS callback
 * @return {Promise<void>} Nothing is returned, AWS callback is used instead
 *
 * @example
 * // Call locally from the CLI:
 * DEBUG=true npx sls invoke local --function getPublications --path test/staticSiteMailer-dummy-payload.json
 *
 * // Expected payload
 * {
 *   "headers": {
 *      "origin": "ORIGIN"
 *   },
 *   "body": "[ { id: "123", "title": "My Post" } ]",
 * }
 */
module.exports.getPublications = async (event, context, callback) => {
  try {
    const headers = util.safeGetHeaders(event.headers.origin);
    const response = await got(GET_PUBLICATIONS_URL);
    // Strip security header
    // const saneResponse = response.body.substr(16);

    // var tObj = parser.getTraversalObj("<test>a</test>");
    // var jsonObj = parser.convertToJson(tObj);
    // console.log(response.body);
    const jsonObj = parser.parse(response.body);
    // const jsonObj = parser.parse("<posts><post>a</post><post>a</post></posts>");

    console.log(jsonObj.rss.channel.item);
    // TODO XML to json
    const responseJson = jsonObj; // JSON.parse(response);
    const posts = jsonObj.rss.channel.item; // responseJson.payload.posts;
    console.log(posts);
    // const users = responseJson.payload.references.User;
    const simplePosts = posts.map(post => ({
      id: post.guid,
      title: post.title,
      author: post['dc:creator'], // users[post.creatorId].name,
      // authorImg: users[post.creatorId].imageId,
      latestPublishedAt: post.pubDate, // post.latestPublishedAt,
      uniqueSlug: post.link, // post.uniqueSlug,
      // // TODO filter paragraphs that are empty or equal to the title
      paragraphs: post['content:encoded'], // post.previewContent.bodyModel.paragraphs.map(p => p.text),
      // previewImgId: post.virtuals.previewImage.imageId,
    }));
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(simplePosts),
    });
  } catch (err) {
    console.log(err, err.stack);
    callback('Failed GET_PUBLICATIONS ' + err);
  }
};
