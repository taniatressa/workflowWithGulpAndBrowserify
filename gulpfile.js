//gulp coffe to covert coffe script
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat');;

var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

var sassSources = ['components/sass/style.scss'];
//to keep trACK OF HTML changes
var htmlSources = ['builds/development/*.html'];
//to keep track of json changes
var jsonSources = ['builds/development/js/*.json'];

/*procees coffee script
add src and pipe to coffe var
 bare - complies js without putting it on safety wrapper
once we finish processing put it to dest folder*/
gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});
/*get the array of sources and piped to concat and name it as script.js
script.js is used because in html above template with id speakerstpl we have
mentioned src = script.js
*/
gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('build/development/js'))
    .pipe(connect.reload())
});
// style : expanded means type of style either expanded compact etc
//convert everything to style.css
//connect reloads as soon as js is changed
gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: 'build/development/images',
      style: 'expanded'
    })
    .on('error', gutil.log))
    .pipe(gulp.dest('build/development/css'))
     .pipe(connect.reload())
});
/*watches and procees a series of task
like something in coffe changed keep note of it*/
gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
   gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['json']);
});

/*connect server..*/
gulp.task('connect', function() {
  connect.server({
    root: 'build/development/',
    livereload: true
  });
});
//keep track of html
gulp.task('html', function() {
  gulp.src(htmlSources)
    .pipe(connect.reload())
});
//track of json changes
gulp.task('json', function() {
  gulp.src(jsonSources)
    .pipe(connect.reload())
});
//this will do all the tasks on typing gulp 
gulp.task('default', [ 'html', 'json' ,'coffee', 'js', 'compass', 'connect', 'watch']);