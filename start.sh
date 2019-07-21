#!/usr/bin/env bash

set -e

git pull

COMMIT_HASH=$(git rev-parse HEAD)
export IMAGE_TAG=${COMMIT_HASH:0:6}

./mvnw package

docker build -t working-assistant:${IMAGE_TAG} .

docker-compose up -d