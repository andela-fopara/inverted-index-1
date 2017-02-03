import gulp from 'gulp';
import connect from 'gulp-connect';
import opens from 'gulp-open';
import coveralls from 'gulp-coveralls';
import jasmineBrowser from 'gulp-jasmine-browser';
import watch from 'gulp-watch';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';

const port = process.env.PORT || 8004;

gulp.task('connect', () => {
  connect.server({
    root: '/src',
    port,
    livereload: true
  });
});

gulp.task('openApp', () => {
  gulp.src('./src/index.html')
    .pipe(opens({
      uri: 'http://localhost:8004/'
    }));
});

gulp.task('openTest', () => {
  gulp.src('./jasmine/SpecRunner.html')
    .pipe(opens({
      uri: 'http://localhost:8004/'
    }));
});

gulp.task('watch', () => {
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/**/*.css', ['css']);
  gulp.watch('./src/**/*.js', ['js']);
  gulp.watch('./jasmine/SpecRunner.html', ['specRunner']);
});

gulp.task('html', () => {
  gulp.src('./src/*.html')
    .pipe(connect.reload());
});

gulp.task('css', () => {
  gulp.src('./src/css/*.css')
    .pipe(connect.reload());
});

gulp.task('js', () => {
  gulp.src('./src/js/*.js')
    .pipe(connect.reload());
});

/*gulp.task('test', () => {
  const filesForTest = ['./jasmine/lib/js/inverted-index.js', './jasmine/spec/inverted-index-test.js'];
  return gulp.src(filesForTest)
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({
      port
    }));
});*/

gulp.task("test", function(){
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
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({
      port
    }));
});

gulp.task('default', ['connect', 'open', 'watch', 'html', 'css', 'js']);