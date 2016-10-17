#!/usr/bin/env node

var yargs = require('yargs')
var standardVersion = require('standard-version')
var packDist = require('./pack-dist')
var assetRelease = require('./asset-release')
var exec = require('child_process').execSync

var argv = yargs
    .usage('Usage: $0 <cmd> [options]')
    .boolean(['n', 's', 'a'])
    .alias('n', 'no-verify')
    .describe('n', 'Do not verify hooks')
    .alias('s', 'silent')
    .describe('s', 'Do not print to the console')
    .default('i', 'CHANGELOG.md')
    .alias('i', 'infile')
    .describe('i', 'File to which changes should be written')
    .alias('a', 'assets')
    .describe('a', 'Assets should also be uploaded to the release')
    .default('af', __dirname + '/dist')
    .alias('af', 'asset-folder')
    .describe('af', 'Pick the asset folder')
    .default('t', __dirname + './deploy/auth.json')
    .alias('t', 'token-file')
    .describe('t', 'The file where the token can be found for github')
    .help()
    .alias('help', 'h')
    .example('$0', 'Update changelog and tag release')
    .example('$0 -m "%s: see changelog for details"', 'Update changelog and tag release with custom commit message')
    .wrap(80)
    .argv


// don't do anything if help flag is true
if (!argv.h) {
  standardVersion({
    noVerify: argv.no,
    silent: argv.si,
    infile: argv.i
  }, function (err) {
    if (err) {
      console.error(`standard-version failed with message: ${err.message}`)
    }
    exec('git push --follow-tags origin master')
    if (argv.a) {
      var pkg = require(__dirname + '/package.json')
      var tmpDir = __dirname + '/tmp/' 
      var fileName = pkg.version + '.zip'
      var archive = packDist(argv.af, tmpDir, fileName)
      var token = require(argv.t).token
      archive.on('finish', function () {
        console.log('finished creating a zip, getting ready to upload assets')
          assetRelease(fileName, pkg, token, tmpDir)
      })
    }
  })

}
