#!/bin/sh

# exit on any failure in the pipeline
set -e

# -------------------------------------------------
# pre-commit
# -------------------------------------------------
# Contains the standard set of tasks to run before
# committing changes to the repo. If any tasks fail
# then the commit will be aborted.
# -------------------------------------------------

printf "%b" "Running pre-commit hooks...\\n"
# lint the code
npm run lint:all
# bundle dependencies and update package.json
npm run bundledeps update
git add package.json
# pull up-to-date view jsdocs from the front-end
mkdir -p views && cat csr-ui/pronghorn.jsdoc.js > views/pronghorn.jsdoc.js
# generate pronghorn.json from jsdocs & add any changes
npm run generate
git add pronghorn.json
printf "%b" "Finished running pre-commit hooks\\n"
