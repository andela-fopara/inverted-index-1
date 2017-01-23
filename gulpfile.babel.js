//instruct node to look into the node_modules for the package gulp
import gulp from 'gulp';

//import gulp from 'gulp';

//add the  gulp-connect dependency
import connect from 'gulp-connect';
//import connect2 from 'gulp-connect';

//import connect from 'gulp-connect';

//add the  open dependency require statement
import opens from 'gulp-open';

//import opens from 'gulp-open';

//add the jasmine dependency to actually 
//run the jasmine test suites in .spec files
import jasmines from 'gulp-jasmine-livereload-task';

//add the coveralls dependency
//for code test coverage
import coveralls from 'gulp-coveralls';

//add dependency needed
//to run jasmine tests
//via gulp 
import jasmine from 'gulp-jasmine';
import jasmineBrowser from 'gulp-jasmine-browser';
import watch from 'gulp-watch';

//add babel register
//so that code can 
//be transpiled to es5
import babel_register from 'babel-core/register';


//we start writing our gulp task
//test with hello
gulp.task('hello', () => {
		//statements for the task goes here
		console.log('Hello Zell');
	});

//the connect task to create a webserver running on http://localhost:8001
gulp.task('connect', () => {
    connect.server({
        root: 'src',
        port: 8004,
        livereload: true
    });
});

//adds task to open the 
//web browser at 
//the webserver
//for front-end test

gulp.task('open', () => {
  gulp.src('./src/index.html')
  .pipe(opens({uri: 'http://localhost:8004/'}));
});





//adds task to watch the filesystem and rebuild the project when a change is detected
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

//adds a task to refresh our page automatically when there is a html file file edit
//remember to add a piped connect.reload() to the css task and any other build task present in our project
gulp.task('html', () => {
	gulp.src('./src/*.html')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

//adds a task to refresh our page automatically when there is a html file file edit
//remember to add a piped connect.reload() to the css task and any other build task present in our project
gulp.task('css', () => {
	gulp.src('./src/css/*.css')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

//adds a task to refresh our page automatically when there is a html file file edit
//remember to add a piped connect.reload() to the css task and any other build task present in our project
gulp.task('js', () => {
	 gulp.src('./src/js/*.js')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

gulp.task('ty', ()=> {
  var filesForTest = ['./src/js/inverted-index.js', './jasmine/spec/inverted-index-test.js'];

  return gulp.src(filesForTest)
   .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner())
   .pipe(jasmineBrowser.server({port: 8888}));

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

//enables us to run the gulp test with just a gulp command
gulp.task('default', ['connect','open','watch','html','css','js','coveralls','specRunner']);


