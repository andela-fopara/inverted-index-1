/* */ 
(function(process) {
  'use strict';
  var babel = require('babel-core');
  function createPreprocessor(args, config, logger, helper) {
    var log = logger.create('preprocessor.babel');
    config = config || {};
    function preprocess(content, file, done) {
      log.debug('Processing "%s".', file.originalPath);
      try {
        var options = createOptions(args, config, helper, file);
        file.path = options.filename || file.path;
        var processed = babel.transform(content, options).code;
        done(null, processed);
      } catch (e) {
        log.error('%s\n at %s', e.message, file.originalPath);
        done(e, null);
      }
    }
    return preprocess;
  }
  function createOptions(customConfig, baseConfig, helper, file) {
    customConfig = helper.merge({}, customConfig);
    delete customConfig.base;
    var customPerFile = createPerFileOptions(customConfig, helper, file);
    var basePerFile = createPerFileOptions(baseConfig, helper, file);
    var options = helper.merge({filename: file.originalPath}, baseConfig.options || {}, customConfig.options || {}, basePerFile, customPerFile);
    return options;
  }
  function createPerFileOptions(config, helper, file) {
    return Object.keys(config).filter(function(optionName) {
      return optionName !== 'options';
    }).reduce(function(acc, optionName) {
      var configFunc = config[optionName];
      if (!helper.isFunction(configFunc)) {
        throw new Error('Per-file option "' + optionName + '" must be a function.');
      }
      acc[optionName] = configFunc(file);
      return acc;
    }, {});
  }
  createPreprocessor.$inject = ['args', 'config.babelPreprocessor', 'logger', 'helper'];
  module.exports = {'preprocessor:babel': ['factory', createPreprocessor]};
})(require('process'));
