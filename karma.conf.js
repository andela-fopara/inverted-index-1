// Karma configuration
// Generated on Fri Jan 27 2017 10:42:09 GMT+0100 (WAT)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './jasmine/lib/js/inverted-index.js',
      './jasmine/spec/inverted-index-test.js'
    ],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    // preprocessors: {
    //   'src/js/inverted-index.js': ['coverage']
    // },
    preprocessors: {
      './jasmine/lib/js/inverted-index.js': ['browserify','coverage'],
      './jasmine/spec/inverted-index-test.js': ['browserify']
    },
    browserify: {
            debug: true,
            transform: [ 'babelify' ]
        },
      
      coverageReporter: {
          dir: 'coverage/',
          reporters: [
            { type: 'text-summary' }
          ]
        },
        browserNoActivityTimeout: 180000,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'coveralls'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: process.env.TRAVIS ? ['Chrome_travis_ci'] : ['Chrome'],

    // Custom launchers for travis.
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}