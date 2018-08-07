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
  console.info('AWS.config.accessKeyId = ' + AWS.config.accessKeyId );
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