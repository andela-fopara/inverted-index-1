import gulp from 'gulp';
import connect from 'gulp-connect';
import opens from 'gulp-open';
import jasmines from 'gulp-jasmine-livereload-task';
import coveralls from 'gulp-coveralls';
import jasmine from 'gulp-jasmine';
import jasmineBrowser from 'gulp-jasmine-browser';
import watch from 'gulp-watch';
import babel_register from 'babel-core/register';

const port = process.env.PORT || 8004;

gulp.task('connect', () => {
    connect.server({
        root: 'src',
        port,
        livereload: true
    });
});

gulp.task('open', () => {
  gulp.src('./src/index.html')
  .pipe(opens({uri: 'http://localhost:8004/'}));
});


gulp.task('watch',() => {
	gulp.watch('./src/*.html',['html']);
	gulp.watch('./src/**/*.css',['css']);
	gulp.watch('./src/**/*.js',['js']);
  gulp.watch('./jasmine/SpecRunner.html',['specRunner']);
});

gulp.task('specRunner', () => {
  gulp.src('./jasmine/SpecRunner.html')
  .pipe(gulp.dest('./dist'))
  .pipe(connect.reload());
});

gulp.task('html', () => {
	gulp.src('./src/*.html')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

gulp.task('css', () => {
	gulp.src('./src/css/*.css')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

gulp.task('js', () => {
	 gulp.src('./src/js/*.js')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

gulp.task('test', ()=> {
  var filesForTest = ['./src/js/inverted-index.js', './jasmine/spec/inverted-index-test.js'];
  return gulp.src(filesForTest)
   .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner())
   .pipe(jasmineBrowser.server({port}));

});

//Run 'gulp coveralls' to
//send data to coveralls
gulp.task('coveralls', () => {
  if (!process.env.CI){
  	return;
  }
  return gulp.src('./coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('default', ['connect','open','watch','html','css','js','coveralls','specRunner']);


