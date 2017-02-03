/* */ 
var glob = require('glob');
var path = require('path');
var fs = require('fs');
function flatten(structure) {
  return [].concat.apply([], structure);
}
function expandGlob(file, cwd) {
  return glob.sync(file.pattern || file, {cwd: cwd});
}
var createPattern = function(path) {
  return {
    pattern: path,
    included: true,
    served: true,
    watched: false
  };
};
var createServedPattern = function(path, file) {
  return {
    pattern: path,
    included: file && 'included' in file ? file.included : false,
    served: file && 'served' in file ? file.served : true,
    nocache: file && 'nocache' in file ? file.nocache : false,
    watched: file && 'watched' in file ? file.watched : true
  };
};
function getJspmPackageJson(dir) {
  var pjson = {};
  try {
    pjson = JSON.parse(fs.readFileSync(path.resolve(dir, 'package.json')));
  } catch (e) {
    pjson = {};
  }
  if (pjson.jspm) {
    for (var p in pjson.jspm)
      pjson[p] = pjson.jspm[p];
  }
  pjson.directories = pjson.directories || {};
  if (pjson.directories.baseURL) {
    if (!pjson.directories.packages)
      pjson.directories.packages = path.join(pjson.directories.baseURL, 'jspm_packages');
    if (!pjson.configFile)
      pjson.configFile = path.join(pjson.directories.baseURL, 'config.js');
  }
  return pjson;
}
module.exports = function(files, basePath, jspm, client, emitter) {
  if (!jspm)
    jspm = {};
  if (!jspm.config)
    jspm.config = getJspmPackageJson(basePath).configFile || 'config.js';
  if (!jspm.loadFiles)
    jspm.loadFiles = [];
  if (!jspm.serveFiles)
    jspm.serveFiles = [];
  if (!jspm.packages)
    jspm.packages = getJspmPackageJson(basePath).directories.packages || 'jspm_packages/';
  if (!client.jspm)
    client.jspm = {};
  if (jspm.paths !== undefined && typeof jspm.paths === 'object')
    client.jspm.paths = jspm.paths;
  if (jspm.meta !== undefined && typeof jspm.meta === 'object')
    client.jspm.meta = jspm.meta;
  client.jspm.useBundles = jspm.useBundles;
  client.jspm.stripExtension = jspm.stripExtension;
  var packagesPath = path.normalize(basePath + '/' + jspm.packages + '/');
  var browserPath = path.normalize(basePath + '/' + jspm.browser);
  var configFiles = Array.isArray(jspm.config) ? jspm.config : [jspm.config];
  var configPaths = configFiles.map(function(config) {
    return path.normalize(basePath + '/' + config);
  });
  function getLoaderPath(fileName) {
    var exists = glob.sync(packagesPath + fileName + '@*.js');
    if (exists && exists.length != 0) {
      return packagesPath + fileName + '@*.js';
    } else {
      return packagesPath + fileName + '.js';
    }
  }
  Array.prototype.unshift.apply(files, configPaths.map(function(configPath) {
    return createPattern(configPath);
  }));
  if (jspm.browser) {
    files.unshift(createPattern(browserPath));
  }
  files.unshift(createPattern(__dirname + '/adapter.js'));
  files.unshift(createPattern(getLoaderPath('system-polyfills.src')));
  files.unshift(createPattern(getLoaderPath('system.src')));
  function addExpandedFiles() {
    client.jspm.expandedFiles = flatten(jspm.loadFiles.map(function(file) {
      files.push(createServedPattern(basePath + '/' + (file.pattern || file), typeof file !== 'string' ? file : null));
      return expandGlob(file, basePath);
    }));
  }
  addExpandedFiles();
  emitter.on('file_list_modified', addExpandedFiles);
  jspm.serveFiles.map(function(file) {
    files.push(createServedPattern(basePath + '/' + (file.pattern || file)));
  });
  var jspmPattern = createServedPattern(packagesPath + '!(system-polyfills.src.js|system.src.js)/**', {nocache: jspm.cachePackages !== true});
  jspmPattern.watched = false;
  files.push(jspmPattern);
};
