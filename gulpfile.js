console.log('Node version: ' + process.version);

var gulp   = require('gulp');
var concat = require('gulp-concat'); 
var gulpUt = require('gulp-util');
var rename = require('gulp-rename');  
var uglify = require('gulp-uglify'); 

//script paths
var jsFiles = [ 'lineMath.js', 'data.js', 'game.js' ],  
    jsDest  = '.';

gulp.task('default', function() {  
    return gulp.src(jsFiles)
             .pipe(concat('jquery.find-a-word.js'))
             .pipe(gulp.dest(jsDest))
             .pipe(rename('jquery.find-a-word.min.js'))
             .pipe(uglify()).on('error', gulpUt.log)
             .pipe(gulp.dest(jsDest));
});
