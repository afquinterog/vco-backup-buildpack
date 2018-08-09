VCO Venture Backup buildpack
=======================

This plugin allows to generate backups on S3 of applications being deployed to heroku.

Requires the NodeJS buildpack to be installed. `https://github.com/heroku/heroku-buildpack-nodejs`

# Setting Mandatory Environment Variables for Build
Setting env var
-----

```
VCO_BACKUPS_ACCESS_KEY_ID=<aws access key id>
AWS_SECRET_ACCESS_KEY=<aws secret access key>
AWS_DEFAULT_REGION=<aws-region>
AWS_STATIC_BUCKET_NAME=<s3-bucket-name>

Usage
-----

Example usage:

    $ ls
    hello.txt

    $ heroku create --stack cedar --buildpack http://github.com/heroku/heroku-buildpack-hello.git

    $ git push heroku master
    ...
    -----> Heroku receiving push
    -----> Fetching custom buildpack
    -----> HelloFramework app detected
    -----> Found a hello.txt

The buildpack will detect that your app has a `hello.txt` in the root. If this file has contents, it will be copied to `goodbye.txt` with instances of the world `hello` changed to `goodbye`.

Hacking
-------

To use this buildpack, fork it on Github.  Push up changes to your fork, then create a test app with `--buildpack <your-github-url>` and push to it.

For example, you can change the displayed name of the buildpack to `GoodbyeFramework`. Open `bin/detect` in your editor, and change `HelloFramework` to `GoodbyeFramework`.

Commit and push the changes to your buildpack to your Github fork, then push your sample app to Heroku to test.  You should see:

    -----> GoodbyeFramework app detected
