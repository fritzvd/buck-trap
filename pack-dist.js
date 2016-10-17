var fs = require('fs')
var rimraf = require('rimraf')
var archiver = require('archiver')

function packDist (distDir, tmpDir, fileName) {
  rimraf.sync(tmpDir)
  fs.mkdirSync(tmpDir)

  var writeFileStream = fs.createWriteStream(fileName)
  var archive = archiver.create('zip', {})

  archive.pipe(writeFileStream)

  var destinationWithinZip = ''
  archive.directory(distDir, destinationWithinZip)
  archive.finalize()

  return archive
}

module.exports = packDist
