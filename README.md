VCO Venture Backup buildpack
=======================

This plugin allows to generate backups on S3 of applications being deployed to heroku.

Requires the NodeJS buildpack to be installed. `https://github.com/heroku/heroku-buildpack-nodejs`

Setting environment variables for build
-----

```
VCO_BACKUPS_ACCESS_KEY_ID=<aws access key id>
VCO_BACKUPS_SECRET_ACCESS_KEY=<aws secret access key>
VCO_BACKUPS_REGION=<aws-region>
VCO_BACKUPS_BUCKET_NAME=<s3-bucket-name>
VCO_BACKUPS_APP_NAME=<app-name>

Usage
-----

Example usage:

    $ heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs 
    $ heroku buildpacks:add https://github.com/afquinterog/vco-backup-buildpack.git

    $ git push heroku master

The buildpack will compress the application code and stored it versioned on S3.

