[![Build Status](https://travis-ci.org/code-star/codestar-website-react.svg?branch=develop)](https://travis-ci.org/code-star/codestar-website-react)

<img align=center src=https://cloud.githubusercontent.com/assets/4116708/12473911/e67fdd44-c016-11e5-9c21-5714e07549fe.png width=450 />

*Passionate programmers standing to make a change*

---
# Codestar website

Note: uses custom fork of [react-scripts-ts](https://github.com/code-star/create-react-app-typescript) to
use CSS Modules without ejecting.

**Contents:**

1. [Requirements](#requirements)
1. [Configuration](#configuration)
1. [Developing](#developing)
1. [Deploying](#deploying)
1. [Invoking a function locally](#invoking-a-function-locally)


## TODO

* Add CI/CD with Travis CI: https://docs.travis-ci.com/user/deployment/lambda
* Add inline documentation to the Serverless functions and generate API docs, e.g. http://apidocjs.com/
* Add unit test
* Add linting
* Convert to TS & GraphQL https://graphql-code-generator.com/
* https://github.com/dherault/serverless-offline
* https://github.com/serverless-heaven/serverless-webpack


## Requirements

Uses Node 8.10 (newest available on AWS)

## Configuration

To configure, run:

```bash
npm i -S serverless
npx serverless create --template aws-nodejs --name static-site-mailer
npx sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_ACCESS_KEY
```

(The keys will be stored under `~/.aws/credentials`)

The default region is set in `serverless.yml` and can be added to `sls` with the parameter `-r eu-west-1`

## Developing

## Deploying

Deploy to AWS (TEST stage):

```bash
npx sls deploy --verbose
```

Deploy to AWS (PROD stage):

```bash
npx sls deploy --verbose --stage prod
```

This logs (among others) the `POST` endpoint (https://x.execute-api.us-east-1.amazonaws.com/test/static-site-mailer).

This can be tested with Postman, but to call it from a form, CORS must be configured.



## Invoking a function locally

To invoke the function, run:

- Production:

	```bash
	npx sls invoke --function staticSiteMailer --path serverless/staticSiteMailer-dummy-payload.json
	```
- Test:

	```bash
	STATIC_SITE_MAILER_SOURCE=example@example.com STATIC_SITE_MAILER_DESTINATION=example@example.com DEBUG=true npx sls invoke local --function staticSiteMailer --path serverless/staticSiteMailer-dummy-payload.json
	```

(`--path` is optional and points to a `POST` payload)

**NOTE: Replace `example@example.com` with the email address validated in AWS SES**

The environment variable `DEBUG=true` will allow calls from `localhost:3000`. This can also be enabled on AWS if needed.

The destination email address is set in the environment variable `STATIC_SITE_MAILER_DESTINATION`.
The source email address is set in the environment variable `STATIC_SITE_MAILER_SOURCE`.
You can check the [documentation](https://serverless.com/framework/docs/providers/spotinst/guide/variables/#environment-variables) for
more information about environment variables.

Locally this can be set in a test profile or just by setting the environment variable with
`export STATIC_SITE_MAILER_DESTINATION=example@example.com`. In the code it is accessed via `process.env.STATIC_SITE_MAILER_DESTINATION`.

To change it in AWS:

- Go to `https://eu-west-1.console.aws.amazon.com/lambda/` and find the function
- Scroll to Environment variables and add the correct key/value