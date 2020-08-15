const gulp = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const autoPrefix = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref');
const imageMin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// compile saas to css
gulp.task('sass', () => {
  return gulp
    .src('src/scss/main.scss')
    .pipe(sass())
    .pipe(autoPrefix())
    .pipe(gulp.dest('src/css'));
});

gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss', gulp.series('sass', 'reload'));
  gulp.watch('src/**/*.{html,css,js}', gulp.series('reload'));
});

// Serve devlopment server using browserSync
gulp.task('serve', () => {
  browserSync.init({
    server: './src',
    port: '4000',
    watchOptions: {
      awaitWriteFinish: true,
    },
  });
});

// reload the devlopment server
gulp.task('reload', (done) => {
  browserSync.reload();
  done();
});

// default gulp function to serve our files
gulp.task('default', gulp.parallel('sass', 'serve', 'watch'));

// minify js and css
gulp.task('asset-minify', () => {
  return gulp
    .src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', csso()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

// Minify the images
gulp.task('imgSquash', () => {
  return gulp
    .src('src/images/*')
    .pipe(imageMin())
    .pipe(gulp.dest('dist/images'));
});

// Build the code for production
gulp.task('build', gulp.series('sass', 'asset-minify', 'imgSquash'));
