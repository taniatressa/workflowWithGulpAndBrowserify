//gulp coffe to covert coffe script
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee');

var coffeeSources = ['components/coffee/tagline.coffee'];
//procees coffe d=script
//add src and pipe to coffe var
// bare - complies js without putting it on safety wrapper
//once we finish processing put it to dest folder
gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

