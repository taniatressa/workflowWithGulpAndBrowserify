//gulp coffe to covert coffe script
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

//if env value is not set then we will set  env as development enviroment
env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'build/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'build/production/';
  sassStyle = 'compressed';
}


coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

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
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
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
  gulp.watch('build/development/*.html', ['html']);
  gulp.watch('build/development/js/*.json', ['json']);
  gulp.watch('build/development/images/**/*.*', ['images']);
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
  gulp.src('build/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});
//track of image
gulp.task('images', function() {
  gulp.src('build/development/images/**/*.*')
    .pipe(gulpif(env === 'production', imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngcrush()]
    })))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
    .pipe(connect.reload())
});
//track of json changes
gulp.task('json', function() {
  gulp.src('build/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('build/production/js')))
    .pipe(connect.reload())
});
//this will do all the tasks on typing gulp 
gulp.task('default', [ 'html', 'json' ,'coffee', 'js', 'compass', 'connect', 'images', 'watch']);