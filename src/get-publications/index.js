'use strict';
const util = require('../util');

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
 *   "body": "{ ? }",
 * }
 */
module.exports.getPublications = async (event, context, callback) => {
  try {
    const headers = util.safeGetHeaders(event.headers.origin);
    console.log(headers);
    // const data = await sendEmail(formData, sourceAddress, destinationAddress);
    // callback(null, {
    //   statusCode: 200,
    //   headers,
    //   body: JSON.stringify({
    //     message: data,
    //   }),
    // });
  } catch (err) {
    console.log(err, err.stack);
    callback('Failed GET_PUBLICATIONS ' + err);
  }
};