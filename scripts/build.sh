#!/bin/bash

# Script to build docker image

# Root directory of this project
REPO_DIR="$( cd "$( dirname "$0" )"/.. && pwd )"

USAGE="
Usage: $(basename "$0") [ENVIRONMENT]

Environments:
    dev (default)
    prod
"


TARGET_ENV=$1

if [[ -z $TARGET_ENV ]]; then
    TARGET_ENV="dev"
fi

if [[ "$TARGET_ENV" != "dev" && "$TARGET_ENV" != "prod" ]]; then
    echo "$USAGE";
    exit 1;
fi

docker build -f Dockerfile -t meddao-issuer $REPO_DIR
