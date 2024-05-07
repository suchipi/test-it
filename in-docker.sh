#!/usr/bin/env bash

mkdir -p node_modules_docker

docker run --rm -it \
  -v "$PWD":/opt/test-it \
  -v "$PWD"/node_modules_docker:/opt/test-it/node_modules \
  -w /opt/test-it \
  suchipi/node-nw-env:0.7.0 bash -c "Xvfb -screen 0 1024x768x16 -ac & $@"
