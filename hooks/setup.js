#!/usr/bin/env node
/*eslint-disable */

const fs = require('fs');
/**
 * This script will execute before an npm install command. The purpose is to
 * write out some standard git hooks that will enable folks working on this
 * project to benefit from the protections that the hooks provide.
 */

const precommit = fs.readFileSync('./resources/hooks/pre-commit.sh', 'utf8');
const prepush = fs.readFileSync('./resources/hooks/pre-push.sh', 'utf8');

fs.stat('.git', (err) => {
  if (err === null) {
    // git repo, not an npm repo.
    // add pre-commit hook if it doesn't exist
    fs.stat('.git/hooks/pre-commit', (statErr) => {
      if (statErr === null || statErr.code === 'ENOENT') {
        fs.writeFile('.git/hooks/pre-commit', precommit, {
          mode: 0o755,
        }, (writeErr) => {
          if (writeErr) {
            return console.log(writeErr.message);
          }
          return null;
        });
      } else {
        console.log(statErr.message);
      }
    });
    // add pre-push hook if it doesn't exist
    fs.stat('.git/hooks/pre-push', (statErr) => {
      if (statErr == null || statErr.code === 'ENOENT') {
        fs.writeFile('.git/hooks/pre-push', prepush, {
          mode: 0o755,
        }, (writeErr) => {
          if (writeErr) {
            return console.log(writeErr.message);
          }
          return null;
        });
      } else {
        console.log(statErr.message);
      }
    });
  }
});
