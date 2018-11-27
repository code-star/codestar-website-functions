import test from 'ava';
import sinon from 'sinon';
import AWS from 'aws-sdk';
// Mock for AWS.SES that echos emailParams
sinon.stub(AWS, 'SES').returns({sendEmail(emailParams, cb) {
        // console.log('received email params', emailParams)
        cb(null, emailParams)
    }});
import {staticSiteMailer} from './mailer';

test('Calls callback with error message if invalid origin', t => {
    // TODO https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#callback-support
    staticSiteMailer(
        {
            headers: {
                origin: 'http://localhost:3000',
            },
            body: JSON.stringify({}),
        },
        null,
        (result) => {
            t.is(result, '1Failed STATIC_SITE_MAILER Error: Not white-listed origin: http://localhost:3000')
        });
});

// https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#before--after-hooks
// test.before(t => {
//     // This runs before all tests
//     sinon.stub(AWS, 'SES').returns({sendEmail() {}});
// });

test('Calls callback with ?? if ??', async t => {
    t.plan(1);

    // const x = {
    //     y() {
    //         return 'y';
    //     }
    // };

    // sinon.stub(x, 'y').returns('z');
    // t.is(x.y(), 'z');

    // console.log(sinon.mock, sinon.mock());
    // works: sinon.stub(util, 'safeGetHeaders').throws('TEST ERROR')

    // works if run before import in mailer.js
    // sinon.stub(AWS, 'SES').returns({sendEmail() {}});

    // TODO add prettier

    process.env.STATIC_SITE_MAILER_SOURCE = 'example@example.com';
    await staticSiteMailer(
        {
            headers: {
                origin: 'https://www.codestar.nl',
            },
            body: JSON.stringify({}),
        },
        null,
        (_, result) => {
            // TODO t.deepEqual(result, {
            //     statusCode: 200,
            // });
            t.is(JSON.parse(result.body).message.Source, 'example@example.com')
        });
});

// TODO test sendMail if(err)

// TODO fix so that imports of AWS and SES in mailer.js can be outside sendMail()

// test('Returns header with debug origin', t => {
//     process.env.DEBUG = 'true';
//     const headers = safeGetHeaders('http://localhost:3000');
//     t.deepEqual(headers, {
//             'Access-Control-Allow-Origin': 'http://localhost:3000',
//             'Content-Type': 'application/json',
//         }
//     );
//     delete process.env.DEBUG;
// });
//
// test('Returns header with prod origin', t => {
//     const headers = safeGetHeaders('https://www.codestar.nl');
//     t.deepEqual(headers, {
//             'Access-Control-Allow-Origin': 'https://www.codestar.nl',
//             'Content-Type': 'application/json',
//         }
//     );
// });
