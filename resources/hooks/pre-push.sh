#!/bin/sh

# exit on any failure in the pipeline
set -e

# ----------------------------------------------------------
# pre-push
# ----------------------------------------------------------
# Called by 'git push' after it has checked the
# remote status, but before anything has been
# pushed.  If this script exits with a non-zero
# status nothing will be pushed.
#
# This hook is called with the following parameters:
#
# $1 -- Name of the remote to which the push is being done
# $2 -- URL to which the push is being done
# ----------------------------------------------------------

printf "%b" "Running pre-push hooks...\\n"
# Verify that all tests pass
npm test
printf "%b" "Finished running pre-push hooks\\n"%