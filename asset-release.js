var fs = require('fs')
var github = require('octonode')
var rimraf = require('rimraf')

function startRelease (fileName, pkg, token, tmpDir) {
  var client = github.client(token)
  var ghrepo = client.repo(pkg.repository.name)
  ghrepo.release({
    tag_name: 'v' + pkg.version,
    draft: false
  }, uploadAssets)

  function uploadAssets (err, body) {
    if (err) {
      console.log(err.body, 'bla')
      if (parseInt(err.statusCode) === 422) {
        console.log(`
          Error: ` + err.body + `\n
          It looks like there is already a draft or release on github.
          Go to https://github.com/nens/threedi-frontend/releases/tag/` + version + `\n
          and delete the release. Yes, this is fine. The tag will still be there.
          \n\n
          Then run this again.
          `)
      }
      throw err
    }
    console.log('Created release, getting ready to upload assets')
    var ghrelease = client.release(pkg.repository.name, body.id)
    var readArchive = fs.readFileSync(fileName)

    var htmlUrl = body.html_url

    ghrelease.uploadAssets(readArchive, {
      contentType: 'application/zip',
      name: fileName,
      size: readArchive.length
    }, function (requesterr, status, respbody, headers) {
      if (requesterr) {
        console.log(Object.keys(requesterr), status, respbody, requesterr)
        // var respbodyerrors = requesterr.body.map(function (berr) {
        //   return ['Field:', berr.field, 'Code:', berr.code, berr.message].join(' ')
        // })
        // var message = [requesterr.message].concat(respbodyerrors)
        // throw new Error(message.join('\n'))
      }

      console.log('Created new release and uploaded assets at: \n' + htmlUrl)
       rimraf(tmpDir, function (rerr) {
         if (rerr) { throw rerr }
         console.log('Succesfully cleaned up tmp folder')
       })
    })
  }

}

module.exports = startRelease
