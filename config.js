'use strict';

// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
const nconf = (module.exports = require('nconf'));
const path = require('path');

let sampleConfigJSON = `{
  "GCLOUD_PROJECT" : "AGCLOUD_PROJECT_NAME",
  "MONGOUSERNAME": "YOUR_MONGOUSERNAME",
  "MONGOPWD" : "YOUR_MONGOPASSWORD",
  "MONGOCLUSTER" : "YOUR_MONGOCLUSTERURL",
  "JWTSECRET":"YOURJWTSECRETKEY"
}`;
nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'GCLOUD_PROJECT',
    'GEOSERVICE',
    'MONGOUSERNAME',
    'MONGOPWD',
    'MONGOCLUSTER'
  ])
  // 3. Config file
  .file({file: path.join(__dirname, 'config.json')})
  // 4. Defaults
  .defaults({
    // This is the id of your project in the Google Cloud Developers Console.
    GCLOUD_PROJECT: '',
    GEOSERVICE:'openrouteservice',
    PORT: 8080,
  });

// Check for required settings
checkConfig('GCLOUD_PROJECT', sampleConfigJSON);
checkConfig('MONGOUSERNAME', sampleConfigJSON);
checkConfig('MONGOPWD', sampleConfigJSON);
checkConfig('MONGOCLUSTER', sampleConfigJSON);

function checkConfig(setting, detailsMessage) {
  if (!nconf.get(setting)) {
    console.log(`You must set ${setting} as an environment variable or in config.json!`);
    console.log(`config.json Sample: ${detailsMessage}`);
    throw new Error(
      `You must set ${setting} as an environment variable or in config.json!`
    );
  }
}
