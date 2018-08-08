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
  // the prefix assigned to the path, can be used to configure routing rules in CDNs
  var VCO_BACKUPS_PREFIX = getEnvVariable('VCO_BACKUPS_PREFIX');

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
var VCO_BACKUP_DIRECTORY = path.join(BUILD_DIR, VCO_BACKUP_FOLDER);

// uploaded files are prefixed with this to enable versioning
var BACKUP_PATH = path.join(VCO_BACKUPS_PREFIX, new Date().toISOString(), SOURCE_VERSION);

console.error('SOURCE_VERSION = ' + SOURCE_VERSION ) ;
console.error('BUILD_DIR = ' + BUILD_DIR ) ;
console.error('VCO_BACKUP_DIRECTORY = ' + VCO_BACKUP_DIRECTORY ) ;
console.error('BACKUP_PATH = ' + BACKUP_PATH ) ;



var yearInMs = 365 * 24 * 60 * 60000;
var yearFromNow = Date.now() + yearInMs;

var s3 = new AWS.S3();

fs.readFile( VCO_BACKUP_DIRECTORY + '/data.txt', function (err, file) {
  if (err) { throw err; }


  console.log('Data to upload on new function:', file);

  var contentType = mimeTypes.lookup(path.extname(VCO_BACKUP_DIRECTORY + '/data.txt')) || null;

  if (!_.isString(contentType)) {
    console.warn('Unknown ContentType:', contentType, file);
    contentType = 'application/octet-stream';
  }

  console.log('Bucket:', VCO_BACKUPS_BUCKET_NAME);
  console.log('path:', BACKUP_PATH);

  var yearInMs = 365 * 24 * 60 * 60000;
  var yearFromNow = Date.now() + yearInMs;

  var base64data = new Buffer(file, 'binary')

  s3.upload({
    ACL: 'public-read',
    Key: BACKUP_PATH,
    Body: base64data,
    Bucket: VCO_BACKUPS_BUCKET_NAME,
    Expires: new Date(yearFromNow),
    CacheControl: 'public,max-age=' + yearInMs + ',smax-age=' + yearInMs,
    ContentType: contentType
  }, function(response){
      console.log(response);
  } );

});



// glob(VCO_BACKUP_DIRECTORY + '/**/*.*', {}, function(error, files) {

//     if (error || !files) {
//       return process.exit(1);
//     }

//     console.log('Files to Upload:', files.length);
//     console.time('Upload Complete In');

//     var yearInMs = 365 * 24 * 60 * 60000;
//     var yearFromNow = Date.now() + yearInMs;

//     var s3 = new AWS.S3();
//     async.eachLimit(files, 16, function(file, callback) {

//         var stat = fs.statSync(file);
//         if (!stat.isFile()) {
//           console.log('Not a file', file);
//           return callback(null);
//         }

//         var contentType = mimeTypes.lookup(path.extname(file)) || null;
//         if (!_.isString(contentType)) {
//           console.warn('Unknown ContentType:', contentType, file);
//           contentType = 'application/octet-stream';
//         }

//         console.log('Bucket:', AWS_STATIC_BUCKET_NAME);
//         console.log('path:', BACKUP_PATH);

//         s3.upload({
//           ACL: 'public-read',
//           //Key: path.join(BACKUP_PATH, file.replace(VCO_BACKUP_DIRECTORY, '')),
//           Key: BACKUP_PATH,
//           Body: fs.createReadStream(file),
//           Bucket: AWS_STATIC_BUCKET_NAME,
//           Expires: new Date(yearFromNow),
//           CacheControl: 'public,max-age=' + yearInMs + ',smax-age=' + yearInMs,
//           ContentType: contentType
//         }, callback)

//       },
//       function onUploadComplete(error) {
//         console.timeEnd('Upload Complete In');

//         if (error) {
//           console.error('Static Uploader failed to upload to S3');
//           console.error(error);
//           console.error('Exiting without error');
//           process.exit(0);
//         }

//         // var profiled = process.env.BUILD_DIR + '/.profile.d';
//         // fs.writeFileSync(
//         //   path.join(profiled, '00-upload-static-files-to-s3-export-env.sh'),
//         //   'echo EXPORTING STATIC ENV VARIABLES\n' +
//         //   'export STATIC_SERVER=${STATIC_SERVER:-' + AWS_STATIC_BUCKET_NAME + '.s3.amazonaws.com' + '}\n' +
//         //   'export BACKUP_PATH=${BACKUP_PATH:-/' + BACKUP_PATH + '}\n',
//         //   {encoding: 'utf8'}
//         // );

//         process.exit(0);
//       });
//   }
// );





