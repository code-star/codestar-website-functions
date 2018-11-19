#!/bin/bash

# TODO replace by setting AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY e.g.
# npx sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_ACCESS_KEY

echo TRAVIS_BRANCH is $TRAVIS_BRANCH
if [ "${TRAVIS_BRANCH}" == production ]; then
    STAGE=prod
else
    STAGE=test
fi

export STAGE
echo STAGE is $STAGE
npm run build
sls package --verbose --stage=$STAGE