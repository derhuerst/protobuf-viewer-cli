#!/bin/sh

node -e 'process.stdout.write(require("./test/foo"))' | ./cli.js
