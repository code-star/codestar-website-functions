[![Build Status](https://travis-ci.org/code-star/codestar-website-functions.svg?branch=test)](https://travis-ci.org/code-star/codestar-website-functions)

<img align=center src=https://cloud.githubusercontent.com/assets/4116708/12473911/e67fdd44-c016-11e5-9c21-5714e07549fe.png width=450 />

*Passionate programmers standing to make a change*

---

# Codestar website Serverless functions

**Contents:**

1. [Requirements](#requirements)
1. [Configuration](#configuration)
1. [Developing](#developing)
1. [Deploying](#deploying)


## TODO

- Add CI/CD with Travis CI: https://docs.travis-ci.com/user/deployment/lambda
- Add inline documentation to the Serverless functions and generate API docs, e.g. http://apidocjs.com/
- Add unit test
- Add linting
- Convert to TS & GraphQL https://graphql-code-generator.com/
- https://github.com/dherault/serverless-offline
- https://github.com/serverless-heaven/serverless-webpack


## Requirements

Uses Node 8.10 (latest Node version available on AWS).

When [nvm](https://github.com/creationix/nvm) is installed, this Node version can be activated by running `nvm use` in the root of the project.


## Configuration

To configure, run:

```bash
npm i
npx sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_ACCESS_KEY
```

(The keys will be stored under `~/.aws/credentials`)

The default region is set in `serverless.yml` and can be added to `sls` with the parameter `-r eu-west-1`


## Developing

To invoke a function from the command line, run:

- On AWS with default stage (i.e. `test`). The environmental variables that are configured on the AWS will be used.

	```bash
	npx sls invoke --function staticSiteMailer --path test/staticSiteMailer-dummy-payload.json
	```
- Local sources (note the `local` keyword). The environmental variables must be set locally or inline:

	```bash
	STATIC_SITE_MAILER_SOURCE=example@example.com STATIC_SITE_MAILER_DESTINATION=example@example.com DEBUG=true npx sls invoke local --function staticSiteMailer --path test/staticSiteMailer-dummy-payload.json
	```

(`--path` is optional and points to a `POST` payload)

**NOTE: Replace `example@example.com` with the email address validated in AWS SES**

A list of example calls for each endpoint for local development:

- staticSiteMailer: `STATIC_SITE_MAILER_SOURCE=example@example.com STATIC_SITE_MAILER_DESTINATION=example@example.com DEBUG=true npx sls invoke local --function staticSiteMailer --path test/staticSiteMailer-dummy-payload.json`
- getUpcomingEvents: `DEBUG=true npx sls invoke local --function getUpcomingEvents --path test/staticSiteMailer-dummy-payload.json`
- getPastEvents: `DEBUG=true npx sls invoke local --function getPastEvents --path test/staticSiteMailer-dummy-payload.json`
- getRecentTweets: `SCREEN_NAME=Codestar_nl TWEET_COUNT=3 DEBUG=true npx sls invoke local --function getRecentTweets --path test/staticSiteMailer-dummy-payload.json`

## Environmental variables

The environment variable `DEBUG=true` will allow calls from `localhost:3000`. This can also be enabled on AWS if needed.

For example, the `staticSiteMailer` function requires these environmental variables:

- The destination email address is set in the environment variable `STATIC_SITE_MAILER_DESTINATION`. This must be an address verified in AWS SES.
- The source email address is set in the environment variable `STATIC_SITE_MAILER_SOURCE`. This must be an address verified in AWS SES.

You can check the [documentation](https://serverless.com/framework/docs/providers/spotinst/guide/variables/#environment-variables) for
more information about environment variables.

Locally an environmental variable can be set in a test profile or just by setting the environment variable with
`export STATIC_SITE_MAILER_DESTINATION=example@example.com`. An alternative is setting it inline, like in the examples above.

In the code it is accessed via `process.env.STATIC_SITE_MAILER_DESTINATION`.


## Set up CI

https://docs.travis-ci.com/user/deployment/lambda

> AWS credentials can be passed in via the access_key_id and secret_access_key parameters. If these are not set, Travis will fall back on the standard AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables. If you choose to provide parameters, it is recommended that you encrypt your secret access key. Assuming you have the Travis CI command line client installed, you can do it like this:
> $ travis encrypt "AWS SECRET ACCESS KEY" --add deploy.secret_access_key


## Deploying

**Note** that deployment should only be done by [Travis CI](https://travis-ci.org/code-star/codestar-website-functions).

- New features must be added by pull request to the `test` branch
- Commits to the `test` branch are automatically deployed by Travis CI to the `test` stage on AWS.
- Releases must be done by pull requests from the `test` branch to the `production` branch. 
- Commits to the `production` branch are automatically deployed by Travis CI to the `production` stage on AWS.

**Note** that all dependencies from node_modules that are used in production, need to be packaged. `sls` automatically only
packages dependencies and skips devDependencies.

Although deployments should not be done manually, it might be useful how deployments work.

To deploy to AWS (TEST stage) **do not do this manually**:

```bash
npx sls deploy --verbose
```

Deploy to AWS (PROD stage) **do not do this manually**:

```bash
npx sls deploy --verbose --stage prod
```

This logs (among others) the `POST` endpoint, e.g. `https://[id].execute-api.us-east-1.amazonaws.com/test/static-site-mailer`.

The endpoints can be called with Postman, but to be called from a web application, CORS must be configured.

**Note** that it is still needed to set environmental variables in AWS:

- Go to `https://eu-west-1.console.aws.amazon.com/lambda/` and find the function
- Scroll to Environment variables and add the correct key/value

## Documentation of all endpoints

Generated into API.md
