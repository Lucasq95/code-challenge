#!/bin/bash

docker-compose build && docker-compose run --rm app npm run test
