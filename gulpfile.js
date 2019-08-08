var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');

// sass task
gulp.task('styles', function(done) {
  gulp.src('sass/**/main.sass')
    // compress & minify
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    // add autoprefixers
    .pipe(autoprefixer({
      Browserlist: ['last 2 versions']
    }))
    // rename file
    .pipe(rename({
      basename: 'styles',
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./minified/'))
    .pipe(browserSync.stream());    
    done();
});

// scripts task including es6 syntax
gulp.task('scripts', function(done) {
  gulp.src('js/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(rename({
      basename: 'scripts',
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./minified/'));
    done();
});

// lint task to check syntax
gulp.task('lint', function(done) {
  return gulp.src(['js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
    done();
});


// default when you run gulp
gulp.task('default', gulp.series(['styles', 'scripts', 'lint'], function(done) {
  console.log('What? SUPPORT is evolving!');
  gulp.watch('sass/**/*.sass', gulp.series('styles'));
  gulp.watch('js/**/*.js', gulp.series(['scripts', 'lint']));
  gulp.watch('./index.html').on('change', browserSync.reload);
  browserSync.init({
    server: './',
    open: false,
    logPrefix: 'JLB Support'
  });
  done();
}));