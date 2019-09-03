#!/usr/bin/env node
/* eslint-disable prefer-destructuring */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
// eslint-disable-next-line
const exec = require('child_process').exec;

const files = ['cog.js'];

const REPO_TYPES = {
  GitLab: 'gitlab.com',
  Bitbucket: 'bitbucket.org',
  TMobileAppCSRRehomeNG: 'git@prdpwebit0001:7999'
};

/* The repository type is pulled from package.json's repository URL. This is
 * used to know if a new bitbucket-pipelines.yml file should be copied
 * to the root folder
 */
const packageDotJson = fs.readFileSync('package.json');
const splitURL =
  JSON.parse(packageDotJson)
    .repository
    .url
    .split('/');

/* Example URL: https://bitbucket.org/itential/app-template.git
  * Split and check for a Bitbucket domain or GitLab domain
  */
let repoType;
Object.keys(REPO_TYPES).forEach((k) => {
  if (splitURL.includes(REPO_TYPES[k])) repoType = REPO_TYPES[k];
});

// If there is no recognized
if (repoType === undefined) {
  console.error('' +
    'Unrecognized repository type found in package.json.repository.url. ' +
    'Please add support for your hosting service or fix your repository ' +
    'url to point to a supported git host. postman.json will still be ' +
    'generated, but pipelines will not be updated.' +
  '');
}

function processPronghorn(data) {
  const barebone = {
    variables: [],
    info: {
      name: 'TestCollection',
      _postman_id: 'a8322d16-79db-5acf-555a-5b3f8f620d7a',
      description: '',
      schema: 'https://schema.getpostman.com/json/collection/v2.0.0/collection.json',
    },
    item: [
      {
        name: 'http://localhost:3000/login',
        event: [
          {
            listen: 'test',
            script: {
              type: 'text/javascript',
              exec: [
                // eslint-disable-next-line no-useless-escape
                'postman.setEnvironmentVariable(\"token\", responseBody);',
              ],
            },
          },
        ],
        request: {
          url: 'http://localhost:3000/login',
          method: 'POST',
          header: [
            {
              key: 'Content-Type',
              value: 'application/json',
              description: '',
            },
          ],
          body: {
            mode: 'raw',
            // eslint-disable-next-line no-useless-escape
            raw: '{\n    \"user\":{\n        \"username\" : \"admin@pronghorn\",\n        \"password\" : \"admin\"\n    }\n}',
          },
          description: '',
        },
        response: [],
      },
    ],
  };
  // eslint-disable-next-line prefer-destructuring
  const methods = data.methods;
  methods.forEach((method) => {
    const cur = {};
    // eslint-disable-next-line prefer-destructuring
    cur.name = method.name;
    cur.response = [];
    cur.request = {
      url: {
        raw: `http://localhost:3000/${data.title}${method.route.path}`,
        protocol: 'http',
        host: ['localhost'],
        port: '3000',
        path: [],
        query: [
          {
            key: 'token',
            value: '{{token}}',
            equals: true,
            description: '',
          },
        ],
        variable: [],
      },
      method: method.route.verb,
      header: [],
      body: {},
      description: '',
    };
    barebone.item.push(cur);
  });
  return barebone;
}

function deleteFromBarebone(barebone, name) {
  barebone.item.forEach((func, i) => {
    if (func.name === name) {
      // eslint-disable-next-line
      barebone.item.splice(i, 1);
    }
  });
}

function processJsDoc(barebone, json) {
  const output = [];
  output.push(barebone.item[0]);
  json.forEach((block) => {
    if (block.pronghornType === 'method') {
      // eslint-disable-next-line
      const name = block.name;
      if (block.examples === undefined) {
        // Delete it from barebone
        deleteFromBarebone(barebone, name);
      } else {
        barebone.item.forEach((method) => {
          if (method.name === name) {
            const exs = block.examples;
            exs.forEach((ex) => {
              const func = JSON.parse(JSON.stringify(method));
              const steps = func.request.url.raw.split('/');
              steps.forEach((step, j) => {
                if (step.length > 0 && step.charAt(0) === ':') {
                  const temp = step.substring(1, step.length);
                  if (ex[temp] !== undefined) {
                    steps[j] = ex[temp];
                    // eslint-disable-next-line
                    delete ex[temp];
                  } else {
                    deleteFromBarebone(barebone, name);
                  }
                }
              });
              // eslint-disable-next-line
              func.request.url.raw = `${steps.join('/')}?token={{token}}`;
              const keys = Object.keys(ex);
              if (keys.length !== 0) {
                // eslint-disable-next-line
                func.request.header = [
                  {
                    key: 'Content-Type',
                    value: 'application/json',
                    description: '',
                  },
                ];
                // eslint-disable-next-line
                func.request.body = {
                  mode: 'raw',
                  raw: JSON.stringify(ex),
                };
              }
              output.push(func);
            });
          }
        });
      }
    }
  });
  output.forEach((func, i) => {
    if (i !== 0) {
      const steps = func.request.url.raw.split('?')[0].split('/');
      steps.splice(0, 3);
      // eslint-disable-next-line
      output[i].request.url.path = steps;
    }
  });
  // eslint-disable-next-line
  barebone.item = output;
  if (repoType === REPO_TYPES.Bitbucket) {
    if (barebone.item.length === 1) {
      exec('rm bitbucket-pipelines.yml', (error) => {
        if (error !== null) {
          console.log('exec error: ', error);
        }
      });
      exec('cp utils/postman/bitbucket-pipelines-no-api.yml bitbucket-pipelines.yml', (error) => {
        if (error !== null) {
          console.log('exec error: ', error);
        }
      });
    } else {
      exec('rm bitbucket-pipelines.yml', (error) => {
        if (error !== null) {
          console.log('exec error: ', error);
        }
      });
      exec('cp utils/postman/bitbucket-pipelines.yml bitbucket-pipelines.yml', (error) => {
        if (error !== null) {
          console.log('exec error: ', error);
        }
      });
    }
  }
  fs.writeFile(
    './postman.json',
    JSON.stringify(barebone, null, 4),
    (err) => {
      if (err) {
        console.error(`Error encountered while writing to postman.json:\n${err.stack}`);
      }
    },
  );
}

fs.readFile('./pronghorn.json', 'utf8', (err, data) => {
  const jsonData = JSON.parse(data);
  const barebone = processPronghorn(jsonData);
  const options = {
    json: true,
    configure: './utils/postman/jsdoc.conf',
    files,
    'no-cache': true,
  };

  jsdoc2md.getTemplateData(options)
    .then((json) => {
      processJsDoc(barebone, json);
      console.info('postman collection generated');
    })
    .catch((err4) => {
      console.error(`Error parsing files: ${err4.toString()}`);
      console.error('\n\nIf your JsDoc includes examples, please make sure strings and keys in your object are doubly quoted');
    });
});
