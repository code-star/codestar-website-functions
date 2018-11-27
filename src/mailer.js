'use strict';
// const AWS = require('aws-sdk');
// const SES = new AWS.SES();
const util = require('./util');

function sendEmail(formData, sourceAddress, destinationAddress) {

    const AWS = require('aws-sdk');
    const SES = new AWS.SES();

	return new Promise((resolve, reject) => {
		const emailParams = {
			Source: sourceAddress, // SES SENDING EMAIL
			ReplyToAddresses: [formData.email],
			Destination: {
				ToAddresses: [ destinationAddress ],
			},
			Message: {
				Body: {
					Text: {
						Charset: 'UTF-8',
						Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}`,
					},
				},
				Subject: {
					Charset: 'UTF-8',
					Data: `Message from ${formData.name} through the codestar.nl contact form`,
				},
			},
		};

		SES.sendEmail(emailParams, (err, data) => {
			if (err) {
				reject(err, err.stack);
			} else {
				resolve(data);
			}
		});
	});
}

/**
 * @description Lambda function staticSiteMailer
 *
 * Method: POST
 *
 * Expected fields:
 * - name {string}
 * - email {string}
 * - message {string}
 *
 * Validates the origin URL with {@link safeGetHeaders}
 *
 * Endpoints
 * - on test stage: https://hjoutysc5k.execute-api.eu-west-1.amazonaws.com/test/static-site-mailer
 * - on prod stage: https://267sder6c7.execute-api.eu-west-1.amazonaws.com/prod/static-site-mailer
 *
 * Envars that need to be set:
 * process.env.STATIC_SITE_MAILER_SOURCE;
 * process.env.STATIC_SITE_MAILER_DESTINATION;
 *
 * Both mail addresses need to be validated in AWS SES
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<void>}
 *
 * @example
 * // Call locally from the CLI:
 * STATIC_SITE_MAILER_SOURCE=example@example.com STATIC_SITE_MAILER_DESTINATION=example@example.com DEBUG=true npx sls invoke local --function staticSiteMailer --path test/staticSiteMailer-dummy-payload.json
 *
 * // Expected payload
 * {
 *   "headers": {
 *      "origin": "ORIGIN"
 *   },
 *   "body": "{\"name\": \"Sender Name\",\"email\": \"sender@example.com\",\"message\": \"This is a dummy message to test the contact form\",\"phone\": \"123\"}",
 * }
 */
module.exports.staticSiteMailer = async (event, context, callback) => {
	const formData = JSON.parse(event.body);
	const sourceAddress = process.env.STATIC_SITE_MAILER_SOURCE;
	const destinationAddress = process.env.STATIC_SITE_MAILER_DESTINATION;

	try {
		const headers = util.safeGetHeaders(event.headers.origin);
		const data = await sendEmail(formData, sourceAddress, destinationAddress);
		callback(null, {
			statusCode: 200,
			headers,
			body: JSON.stringify({
				message: data,
			}),
		});
	} catch(err) {
		console.log(err, err.stack);
		callback('Failed STATIC_SITE_MAILER ' + err);
	}
};
