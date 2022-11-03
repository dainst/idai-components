var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;;
var modRewrite = require('connect-modrewrite');
var sass = require('gulp-sass')(require('sass'));
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require("gulp-minify-html");
var Server = require('karma').Server;

var pkg = require('./package.json');

var paths = {
	'build': 'dist/',
	'lib': 'node_modules/',
	'bootstrap': 'node_modules/bootstrap-sass/assets/'
};

// compile sass and concatenate to single css file in build dir
gulp.task('sass', function() {
	return gulp.src('src/idai-components.scss')
	  	.pipe(sass({includePaths: [paths.bootstrap + 'stylesheets/'], precision: 8}))
	  	.pipe(concat(pkg.name + '.css'))
	    .pipe(gulp.dest(paths.build + '/css'))
	    .pipe(reload({ stream:true }));
});

// minify css files in build dir
gulp.task('minify-css', gulp.series('sass', function() {
	return gulp.src(paths.build + '/css/*.css')
		.pipe(cleanCSS({ compatibility: 'ie8' }))
  		.pipe(concat(pkg.name + '.min.css'))
		.pipe(gulp.dest(paths.build + '/css'));
}));

// concatenates all js files in src into a single file in build dir
gulp.task('concat-js', function() {
	return gulp.src(['src/_modules-and-constants.js','src/**/*.js'])
		.pipe(concat(pkg.name + '-no-tpls.js'))
		.pipe(gulp.dest(paths.build))
    	.pipe(reload({ stream:true }));
});

// concatenates and minifies all dependecies into a single file in build dir
gulp.task('concat-deps', function() {
	return gulp.src([
			paths.lib + 'angular/angular.min.js',
			paths.lib + 'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
			paths.lib + 'angular-route/angular-route.min.js',
			paths.lib + 'angular-animate/angular-animate.min.js'
		])
		.pipe(concat(pkg.name + '-deps.js'))
    	.pipe(uglify())
		.pipe(gulp.dest(paths.build));
});

// converts, minifies and concatenates html partials
// in src to a single js file in build dir
gulp.task('html2js', function() {
	return gulp.src('src/**/*.html')
		.pipe(minifyHtml())
		.pipe(templateCache(pkg.name + '-tpls.js', {
			standalone: true,
			module: 'idai.templates',
			transformUrl: function(url) {
				return url.substring(1);
			}
		}))
		.pipe(gulp.dest(paths.build));
});

// minifies and concatenates js files in build dir
gulp.task('minify-js', gulp.series('concat-js', 'html2js', function() {
    var gutil = require('gulp-util');
	return gulp.src([paths.build + '/' + pkg.name + '-no-tpls.js',
			paths.build + '/' + pkg.name + '-tpls.js'])
	.pipe(concat(pkg.name + '.js'))
    	.pipe(gulp.dest(paths.build))
    	.pipe(uglify())
        //.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
		.pipe(concat(pkg.name + '.min.js'))
    	.pipe(gulp.dest(paths.build));
}));

gulp.task('copy-fonts', function() {
	return gulp.src(['fonts/**', paths.bootstrap + '/fonts/**/*'])
  		.pipe(gulp.dest(paths.build + '/fonts'));
});

gulp.task('build', gulp.series(
	'sass',
	'minify-css',
	'concat-js',
	'concat-deps',
	'html2js',
	'minify-js',
	'copy-fonts'
));

// clean
gulp.task('clean', function() {
	return del(paths.build + '/**/*');
});

// runs the development server and sets up browser reloading
gulp.task('server', gulp.series('sass', 'concat-js', 'html2js', 'copy-fonts', function() {
	browserSync({
		server: {
			baseDir: '.',
        	middleware: [
        		// rewrite for AngularJS HTML5 mode, redirect all non-file urls to index.html
				modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.gif|\\.json|\\.woff2|\\.woff|\\.ttf$ /index.html [L]']),
        	]
		},
		port: 8084
	});

	gulp.watch('src/**/*.scss', gulp.series('sass'));
	gulp.watch('src/**/*.js', gulp.series('concat-js'));
	gulp.watch('src/**/*.html', gulp.series('html2js'));

	gulp.watch(['index.html',
		'demo/**/*.html',
		'partials/**/*.html',
		'src/**/*.html',
		'js/*.js'], reload);
}));

gulp.task('default', function() {
	runSequence('clean', 'test', 'build');
});
