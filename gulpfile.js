var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');

gulp.task("default", function() {
	return gulp.src("public/css/*.scss")
		.pipe(watch())
		.pipe(sass({style: "compressed"}))
		.pipe(gulp.dest("public/css/"));
});