/**
 * init.js
 * This script is intended to be invoked at the beginning of a project
 * just after the checkout of the app-template repo. It will handle
 * some additional customizations of the template.
 */

// eslint-disable-next-line
const exec = require('child_process').exec;
const fs = require('fs');
const readline = require('readline');
const packageDotJson = require('../package.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let { name, description, homepage } = packageDotJson;
let version = '0.1.0';
let repo = 'bitbucket.org';

/**
 * Validates some input provided by stdin. Exits non-zero if a
 * value is not set.
 * @param {string} input - The text captured from stdin.
 * @param {string} field - The name of the field.
 * @private
 */
function checkInput(input, field) {
  if (!input) {
    console.log(`You must provide a ${field} for this application!`);
    process.exit(1);
  }
}

/**
 * Creates a standard link to a project's homepage in a given repo.
 * @param {string} hostname - The hostname of the project's repo.
 * @param {string} appName - The name of the app from stdin.
 * @returns {string} - The standard homepage url of this project.
 */
function makeHomepageUrl(hostname, appName) {
  return `https://${hostname}/itential/${appName}#readme`;
}

/**
 * Creates a standard git link to a project's repo.
 * @param {string} hostname - The hostname of the project's repo.
 * @param {string} appName - The name of the app from stdin.
 * @returns {string} - The standard git url of this project.
 */
function makeRepoUrl(hostname, appName) {
  return `git+https://${hostname}/itential/${appName}.git`;
}

/**
 * Creates a standard git remote url
 * @param {string} hostname - The hostname of the project's repo.
 * @param {string} appName - The name of the app from stdin.
 * @returns {string} - The standard git remote url of this project.
 */
function makeRemoteUrl(hostname, appName) {
  return `git@${hostname}:itential/${appName}.git`;
}

/**
 * Checks that the user entered semver is the correct pattern.
 * @param {string} semver - The user entered semver format.
 * @returns {boolean} - True, param is valid semver. False, it is not valid.
 */
function checkSemVerFormat(semver) {
  const semverRegex = new RegExp(/^[0-9]+\.[0-9]+\.[0-9]+$/);
  return semverRegex.test(semver);
}

let remote = '';

/* Prompt user for some information to customize this application */
rl.question('Please privide a scope. The scope must start with "@". Use "@itential" for internal project: ', (customer) => {
  if (!customer.startsWith('@')) {
    console.log('Scope must start with "@"');
    process.exit(1);
  }
  rl.question('Please provide an application name: ', (answer1) => {
    checkInput(answer1, 'name');
    if (!answer1.startsWith('app-')) {
      console.log('Apps are required to start with "app-". Please follow this convention!');
      process.exit(1);
    }
    if (!answer1.match(/^app-[0-9A-Za-z]+$/)) {
      console.log('Apps are required to follow app-[alphanums]. Please follow this convention!');
      process.exit(1);
    }
    name = answer1;

    rl.question('Please provide an application description: ', (answer2) => {
      checkInput(answer2, 'description');
      description = answer2;

      rl.question('Please provide an initial version: (0.1.0) ', (answer3) => {
        if (!answer3) {
          console.log('Using default version');
        } else if (!checkSemVerFormat(answer3)) {
          console.log(`Invalid semver format! Using default semver: ${version}`);
        } else {
          version = answer3;
        }

        rl.question('Is this a bitbucket (B) or gitlab (G) repo? ', (answer4) => {
          let host = '';
          if (answer4.toUpperCase() === 'B') {
            host = 'bitbucket.org';
            homepage = makeHomepageUrl(host, name);
            repo = makeRepoUrl(host, name);
            remote = makeRemoteUrl(host, name);
            // remove gitlab ci file
            fs.unlinkSync('../.gitlab-ci.yml');
          } else if (answer4.toUpperCase() === 'G') {
            host = 'gitlab.org';
            homepage = makeHomepageUrl(host, name);
            repo = makeRepoUrl(host, name);
            remote = makeRemoteUrl(host, name);
            // remove bitbucket pipelines file
            fs.unlinkSync('../bitbucket-pipelines.yml');
          } else {
            console.log(`Unrecognized repo option: ${answer4}, aborting changes!`);
            process.exit(1);
          }

          /* Display everything back to user and ask for verification */
          console.log('Initializing package.json with these values:');
          console.log(`Scope: ${customer}`);
          console.log(`Name: ${name}`);
          console.log(`Description: ${description}`);
          console.log(`Version: ${version}`);
          console.log(`Homepage URL: ${homepage}`);
          console.log(`Repo URL: ${repo}`);
          rl.question('Type "yes" to use these values: ', (answer) => {
            if (answer.toLowerCase() !== 'yes') {
              console.log('Aborting changes!');
              process.exit(1);
            } else {
              /* Write the changes to the package.json file */
              console.log('Saving changes...');
              packageDotJson.name = `${customer}/${name}`;
              packageDotJson.description = description;
              packageDotJson.version = version;
              packageDotJson.homepage = homepage;
              packageDotJson.repository.url = repo;
              fs.writeFileSync('../package.json', JSON.stringify(packageDotJson, null, 2));
              exec('rm ../README.md', (error) => {
                if (error !== null) {
                  console.log('exec error: ', error);
                }
              });
              exec('cp ./README.md ..', (error) => {
                if (error !== null) {
                  console.log('exec error: ', error);
                }
              });
              rl.question(`Do you want to set your git remote to ${remote} now? (yes/no)`, (setRemote) => {
                if (setRemote.toLowerCase() !== 'yes') {
                  console.log('Removing remote app-template');
                  exec('git remote remove origin', (error) => {
                    if (error !== null) {
                      console.log('Error: Git remote removal failed', error);
                    }
                  });
                  console.log('Git remote removed. Use "git remote add origin yourRemoteUrl" to add it later');
                } else {
                  console.log(`Setting remote to ${remote}`);
                  exec(`git remote set-url origin ${remote}`, (error) => {
                    if (error !== null) {
                      console.log('Error: Git remote set failed', error);
                    }
                  });
                  console.log(`Git remote set to ${remote}`);
                }
                console.log('Finished!');
                process.exit(0);
              });
            }
          });
        });
      });
    });
  });
});
