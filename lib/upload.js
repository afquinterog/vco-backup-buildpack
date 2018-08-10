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

  //Get aws configuration from environment
  AWS.config.maxRetries = 10;
  AWS.config.accessKeyId = getEnvVariable('VCO_BACKUPS_ACCESS_KEY_ID');
  AWS.config.secretAccessKey = getEnvVariable('VCO_BACKUPS_SECRET_ACCESS_KEY');
  AWS.config.region = getEnvVariable('VCO_BACKUPS_REGION');
  var VCO_BACKUPS_BUCKET_NAME = getEnvVariable('VCO_BACKUPS_BUCKET_NAME');
  var VCO_BACKUP_FOLDER = 'backup';
  var VCO_BACKUPS_APP_NAME = getEnvVariable('VCO_BACKUPS_APP_NAME');

} catch(error) {
  console.error('Some environment variables are not properly set');
  console.error(error);
  console.error('Exiting without error');
  process.exit(0);
}


// the sha-1 or version supplied by heroku used to version builds in the path
var SOURCE_VERSION = (process.env.SOURCE_VERSION || '').slice(0, 7);
//Get build dir 
var BUILD_DIR = process.env.BUILD_DIR;
//Build backup directory
var VCO_BACKUP_DIRECTORY = path.join(BUILD_DIR, VCO_BACKUP_FOLDER);
// uploaded files are prefixed with this to enable versioning
var BACKUP_PATH = path.join(VCO_BACKUPS_APP_NAME, new Date().toISOString(), SOURCE_VERSION) + '.tgz';

var s3 = new AWS.S3();

fs.readFile( VCO_BACKUP_DIRECTORY + '/backup.tgz', function (err, file) {
  if (err) { throw err; }

  var contentType = mimeTypes.lookup(path.extname(VCO_BACKUP_DIRECTORY + '/backup.tgz')) || null;

  if (!_.isString(contentType)) {
    //console.warn('Unknown ContentType:', contentType, file);
    contentType = 'application/octet-stream';
  }

  s3.upload({
    ACL: 'private',
    Key: BACKUP_PATH,
    Body: file,
    Bucket: VCO_BACKUPS_BUCKET_NAME,
    ContentType: contentType
  }, function(response){
      console.log(response);
  } );

});






