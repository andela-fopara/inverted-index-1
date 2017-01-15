
//instruct node to look into the node_modules for the package gulp
var gulp = require('gulp');

//add the  gulp-connect dependency
var connect = require('gulp-connect');

//add the  open dependency require statement
var opens = require('gulp-open');

//add the jasmine dependency to actually run the jasmine test suites in .spec files
var jasmines = require('gulp-jasmine-livereload-task');

//add dependency for opening

//we start writing our gulp task
//test with hello
gulp.task('hello', function(){
		//statements for the task goes here
		console.log('Hello Zell');
	});

//the connect task to create a webserver running on http://localhost:8001
gulp.task('connect', function () {
    connect.server({
        root: 'src',
        port: 8004,
        livereload: true
    });
});

//adds task to open the web browser at the webserver
gulp.task('open', function(){
	gulp.src('src/index.html')
	.pipe(opens({uri: 'http://localhost:8004/'}));
});

//adds task to watch the filesystem and rebuild the project when a change is detected
gulp.task('watch',function(){
	gulp.watch('./src/*.html',['html']);
	gulp.watch('./src/**/*.css',['css']);
	gulp.watch('./src/**/*.js',['js']);
});

//adds a task to refresh our page automatically when there is a html file file edit
//remember to add a piped connect.reload() to the css task and any other build task present in our project
gulp.task('html', function(){
	gulp.src('./src/*.html')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

//adds a task to refresh our page automatically when there is a html file file edit
//remember to add a piped connect.reload() to the css task and any other build task present in our project
gulp.task('css', function(){
	gulp.src('./src/css/*.css')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

//adds a task to refresh our page automatically when there is a html file file edit
//remember to add a piped connect.reload() to the css task and any other build task present in our project
gulp.task('js', function(){
	 gulp.src('./src/js/*.js')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

//add a default task that uses jasmine to watch for changes in any of our tests suite in the spec file and starts the test
gulp.task('default', jasmines({
    files: ['./spec/**/*.js'],
    watch: {
        options: {
            debounceTimeout: 1000, //The number of milliseconds to debounce. 
            debounceImmediate: true //This option when set will issue a callback on the first event. 
        }
    },
    host: 'localhost',
    port: 8004,

}));



//enables us to run the gulp test with just a gulp command
gulp.task('default', ['connect','open','watch','html','css','js']);
