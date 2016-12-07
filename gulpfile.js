//gulp coffe to covert coffe script
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat');;

var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
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
});
