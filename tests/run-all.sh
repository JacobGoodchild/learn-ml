#!/bin/sh
# Run every check. Usage: sh tests/run-all.sh
set -e
cd "$(dirname "$0")/.."
node tests/maths.test.mjs
node tests/progress.test.mjs
node tests/content.test.mjs
