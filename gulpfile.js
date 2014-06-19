var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var nodemon = require('gulp-nodemon');

gulp.task("sass", function() {
	return gulp.src("public/css/*.scss")
		.pipe(watch())
		.pipe(sass({style: "compressed"}))
		.pipe(gulp.dest("public/css/"));
});

gulp.task("default",function() {
	nodemon({script: 'index.js'})
		.on('change', ['sass'])
		.on('restart', function() {
			console.log("restarted");
		});
});