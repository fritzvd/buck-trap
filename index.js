#!/usr/bin/env node

var yargs = require('yargs')
var standardVersion = require('standard-version')
var packDist = require('./lib/pack-dist')
var assetRelease = require('./lib/asset-release')
var exec = require('child_process').execSync
var readline = require('readline')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function exec_cb(prompt, cb) {
  rl.question(prompt, function (ans) {
    rl.close();
    if (ans && ans[0].toUpperCase() === 'Y') {
      console.log("OK, we will upload the archive to github.com");
      cb();
    } else {
      console.log("Aborting upload of archive.");
    }
  });
}

var cwd = process.cwd()
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
    .default('af', cwd + '/dist')
    .alias('af', 'asset-folder')
    .describe('af', 'Pick the asset folder')
    .default('t', cwd + '/deploy/auth.json')
    .alias('t', 'token-file')
    .describe('t', 'The file where the token can be found for github')
    .default('b', 'master')
    .alias('b', 'branch')
    .describe('b', 'Which branch should be used for pushing and tagging')
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
    if (argv.a) {
      // otherwise a release can't be drafted
      exec('git push --follow-tags origin ' + argv.b)
      var pkg = require(cwd + '/package.json')
      var tmpDir = cwd + '/tmp/'
      var fileName = 'v' + pkg.version + '.zip'
      var archive = packDist(argv.af, tmpDir, fileName)
      var token = require(argv.t).token
      archive.on('finish', function () {
        console.log('finished creating a zip, getting ready to upload assets')
        var size = archive.pointer();
        console.log("The size of the release/archive is: " + size + " bytes..");
        exec_cb("Are yo sure you want to upload this to Github? ", function () {
          assetRelease(fileName, pkg, token, tmpDir)
        });
      })
    }
  })

}
