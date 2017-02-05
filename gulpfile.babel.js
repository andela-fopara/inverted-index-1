import gulp from 'gulp';
import connect from 'gulp-connect-multi';
import opens from 'gulp-open';
import coveralls from 'gulp-coveralls';
import jasmineBrowser from 'gulp-jasmine-browser';
import watch from 'gulp-watch';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import karma from 'karma';
import gutil from 'gulp-util';

const Server = karma.Server;

const port = process.env.PORT || 8004;

var appServer = connect(),
    jasmineTestServer = connect();

gulp.task('appConnect', appServer.server({
  root: ['./src'],
  port: 8888,
  livereload: true,
  open: {
    browser: 'Google Chrome'  // if not working OS X browser: 'Google Chrome' 
  }
}));

gulp.task('jasmineTestConnect', jasmineTestServer.server({
  root: ['./jasmine'],
  port,
  livereload: false,
  open: {
    browser: 'Google Chrome' // if not working OS X browser: 'Google Chrome' 
  }
}));

gulp.task('sendCoverage', (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function(err){
        if(err === 0){
            done();
        } else {
            done(new gutil.PluginError('karma', {
                message: 'Karma Tests failed'
            }));
        }
    }).start();
});

gulp.task('watch', () => {
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/**/*.css', ['css']);
  gulp.watch('./src/**/*.js', ['js']);
  gulp.watch('./jasmine/*.html', ['htmlJasmine']);
  gulp.watch('./jasmine/**/*.js', ['jsJasmine']);
});

gulp.task('html', () => {
  gulp.src('./src/*.html')
    .pipe(appServer.reload());
});

gulp.task('css', () => {
  gulp.src('./src/css/*.css')
    .pipe(appServer.reload());
});

gulp.task('js', () => {
  gulp.src('./src/js/*.js')
    .pipe(appServer.reload());
});
gulp.task('jsJasmine', () => {
  gulp.src('./jasmine/**/*.js')
    .pipe(jasmineTestServer.reload());
});
gulp.task('htmlJasmine', () => {
  gulp.src('./jasmine/*.html')
    .pipe(jasmineTestServer.reload());
});

gulp.task("build", function(){
    const filesForTest = ['./jasmine/spec/inverted-index-test.js'];
    return browserify({
        entries: filesForTest
    })
    .transform(babelify.configure({
        presets : ["es2015"]
    }))
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("jasmine/build"))
});

gulp.task('default', ['appConnect','jasmineTestConnect','sendCoverage', 'watch', 'html', 'css', 'js']);

