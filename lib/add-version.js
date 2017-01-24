var fs = require('fs')

/**
 * Adds a script tag to the index.html in the distDir.
 *
 * The script tag adds a camelCasedName as key to the window with object
 * containing the version.
 *
 */
function addVersion (distDir, name, version) {

  var camelCasedName = name.replace(
    /-([a-z])/g,
    function (g) { return g[1].toUpperCase(); }
  );
  var script = `((
    function () {
      window.${camelCasedName} = window.${camelCasedName} || {};
      window.${camelCasedName}.version = '${version}';
    }
  )())`
  var tag = '</body>'
  var content = `<script>${script}</script>\n${tag}`
  var file = `${distDir}/index.html`

  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    var indexHTML = data;

    if (!indexHTML) {
      console.log('No index.html, not including version')
    } else {
      var versionedIndexHTML = indexHTML.replace(tag, content);

      fs.writeFile(file, versionedIndexHTML, function (err) {
        if (err) throw err;
      });
    }

  });
}

module.exports = addVersion
