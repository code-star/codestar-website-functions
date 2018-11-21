#!/bin/bash
# Determine stage
echo TRAVIS_BRANCH is $TRAVIS_BRANCH
if [ "${TRAVIS_BRANCH}" == production ]; then
    STAGE=prod
elif [ "${TRAVIS_BRANCH}" == test ]; then
    STAGE=test
else
    echo Non monitored branch \"$TRAVIS_BRANCH\", skipping deploy
    exit
fi
export STAGE
echo STAGE is $STAGE
# Change attributes on node_modules for AWS
chmod -R 777 node_modules
# Set the AWS credentials from environmental variables
sls config credentials --provider aws --key $AWS_ACCESS_KEY_ID --secret $AWS_SECRET_ACCESS_KEY
# Make a package and deploy for the selected stage
sls deploy --verbose --stage=$STAGE
