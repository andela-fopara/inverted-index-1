/* */ 
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: ['node_modules/babel-polyfill/dist/polyfill.js', 'test/*.js'],
    exclude: [],
    plugins: ['karma-jasmine', 'karma-phantomjs-launcher', require('./lib/index')],
    preprocessors: {'test/**/*.js': 'babel'},
    babelPreprocessor: {options: {presets: ['es2015']}},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  });
};
