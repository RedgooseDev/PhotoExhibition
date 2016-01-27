var log = function(o) { console.log(o); }

var gulp = require('gulp');
var concat = require('gulp-concat');
var scss = require('gulp-sass');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


var dist = './dist';
var src = './src';
var vendors = {
	js : [
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/react/dist/react.js',
		'./node_modules/react-dom/dist/react-dom.min.js',
		'./node_modules/fastclick/lib/fastclick.min.js',
		'./src/vendor/Swipe/swipe.min.js'
	],
	css : []
};
var minifis = {
	js : [
		'./node_modules/fastclick/lib/fastclick.js'
	],
	css : []
};


// Minify files
gulp.task('minify', function(){
	minifis.js.forEach(function(o){
		var dir = o.substring(0,o.lastIndexOf("/")+1);
		gulp.src(o)
			.pipe(uglify())
			.pipe(rename({ suffix : '.min' }))
			.pipe(gulp.dest(dir));
	});
	minifis.css.forEach(function(o){
		var dir = o.substring(0,o.lastIndexOf("/")+1);
		gulp.src(o)
			.pipe(scss({
				outputStyle: 'compressed'
			}).on('error', scss.logError))
			.pipe(rename({ suffix : '.min' }))
			.pipe(gulp.dest(dir));
	});
});


// build vendor files
gulp.task('vendor', function(){
	if (vendors.js.length)
	{
		gulp.src(vendors.js)
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(concat('vendor.pkgd.js', { newLine: '\n\n' }))
			.pipe(sourcemaps.write('maps'))
			.pipe(gulp.dest(dist + '/js'));
	}

	if (vendors.css.length)
	{
		gulp.src(vendors.css)
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(concat('vendor.pkgd.css', { newLine: '\n\n' }))
			.pipe(sourcemaps.write('maps'))
			.pipe(gulp.dest(dist + '/css'));
	}
});


// build javascript
gulp.task('js', function(){
	browserify(src + '/js/app.js', { debug: true })
		.transform(babelify, { presets : ['es2015', 'react'] })
		.bundle()
		.pipe(source('app.pkgd.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(dist + '/js'));
});
gulp.task('js:watch', function(){
	gulp.watch(['./src/js/**/*.js', './src/jsx/**/*.jsx'], ['js']);
});


// build scss
gulp.task('scss', function(){
	gulp.src(src + '/scss/layout.scss')
		.pipe(sourcemaps.init())
		.pipe(scss({
			//outputStyle : 'compact'
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(rename({ suffix: '.pkgd' }))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(dist + '/css'));
});
gulp.task('scss:watch', function(){
	gulp.watch(src + '/scss/*.scss', ['scss']);
});
