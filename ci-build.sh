#!/bin/bash
# Set the AWS credentials from environmental variables
sls config credentials --provider aws --key $AWS_ACCESS_KEY_ID --secret $AWS_SECRET_ACCESS_KEY
# Determine stage
echo TRAVIS_BRANCH is $TRAVIS_BRANCH
if [ "${TRAVIS_BRANCH}" == production ]; then
    STAGE=prod
else
    STAGE=test
fi
export STAGE
echo STAGE is $STAGE
# Change attributes on node_modules for AWS
chmod -R 777 node_modules
# Make a package and deploy for the selected stage
sls deploy --verbose --stage=$STAGE