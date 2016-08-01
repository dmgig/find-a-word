console.log('Node version: ' + process.version);

var gulp   = require('gulp');
var concat = require('gulp-concat'); 
var jslint = require('gulp-jslint'); 
var gulpUt = require('gulp-util');
var rename = require('gulp-rename');  
var uglify = require('gulp-uglify'); 

//script paths
var jsFiles = [ 'lineMath.js', 'data.js', 'game.js' ],  
    jsDest  = '.';

// Lint Task
gulp.task('lint', function() {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('js', function() {  
    return gulp.src(jsFiles)
             .pipe(concat('dist.js'))
             .pipe(gulp.dest(jsDest))
             .pipe(rename('dist.min.js'))
             .pipe(uglify()).on('error', gulpUt.log)
             .pipe(gulp.dest(jsDest));
});
