var AWS = require('aws-sdk');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var mimeTypes = require('mime-types');
var shelljs = require('shelljs');

function getEnvVariable(name) {
  return process.env[name] || fs.readFileSync(path.join(process.env.ENV_DIR, name), {encoding: 'utf8'});
}

try {

  // AWS.config.logger = process.stdout;
  AWS.config.maxRetries = 10;

  AWS.config.accessKeyId = getEnvVariable('AWS_ACCESS_KEY_ID');
  console.error('AWS.config.accessKeyId = ' + AWS.config.accessKeyId ) ;
  AWS.config.secretAccessKey = getEnvVariable('AWS_SECRET_ACCESS_KEY');
  AWS.config.region = getEnvVariable('AWS_DEFAULT_REGION');

  // bucket where static assets are uploaded to
  var AWS_STATIC_BUCKET_NAME = getEnvVariable('AWS_STATIC_BUCKET_NAME');
  // the source directory of static assets
  var AWS_STATIC_SOURCE_DIRECTORY = getEnvVariable('AWS_STATIC_SOURCE_DIRECTORY');
  // the prefix assigned to the path, can be used to configure routing rules in CDNs
  var AWS_STATIC_PREFIX = getEnvVariable('AWS_STATIC_PREFIX');

} catch(error) {
  console.error('Static Uploader is not configured for this deploy');
  console.error(error);
  console.error('Exiting without error');
  process.exit(0);
}


// the sha-1 or version supplied by heroku used to version builds in the path
var SOURCE_VERSION = (process.env.SOURCE_VERSION || '').slice(0, 7);
var BUILD_DIR = process.env.BUILD_DIR;
// location of public assets in the heroku build environment
var PUBLIC_ASSETS_SOURCE_DIRECTORY = path.join(BUILD_DIR, AWS_STATIC_SOURCE_DIRECTORY);
// uploaded files are prefixed with this to enable versioning
var STATIC_PATH = path.join(AWS_STATIC_PREFIX, new Date().toISOString().split('T')[0], SOURCE_VERSION);

console.error('SOURCE_VERSION = ' + SOURCE_VERSION ) ;
console.error('BUILD_DIR = ' + BUILD_DIR ) ;
console.error('PUBLIC_ASSETS_SOURCE_DIRECTORY = ' + PUBLIC_ASSETS_SOURCE_DIRECTORY ) ;
console.error('STATIC_PATH = ' + STATIC_PATH ) ;






