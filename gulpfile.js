const gulp = require('gulp');
const concat = require('gulp-concat');
//const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
//const cssmin = require('gulp-cssmin');
//const del = require('del');
const babel = require('gulp-babel');

function htmls() {
    return gulp.src('./src/index.html')
                .pipe(gulp.dest('./build'));
}

function styles() {
    return gulp.src('./src/css/style.css')
                .pipe(autoprefixer({
                    overrideBrowserlist: ['> 1%'],
                    cascade: false
                }))
		        .pipe(gulp.dest('./build/css'));
}

function scripts() {
	return gulp.src(['./src/js/script.js'])
				.pipe(concat('script.js'))
				.pipe(babel({
		            presets: ['@babel/env']
		        }))
				.pipe(gulp.dest('./build/js'));
}

function watch() { 
    gulp.watch('./src/*.html', htmls);
	gulp.watch('./src/css/**/*.css', styles);
	gulp.watch('./src/js/**/*.js', scripts);
}

function clean() {
	return del(['./*.css', './script.js']);
}

gulp.task('htmls', htmls);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);