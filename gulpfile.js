var path = require('path'),
    gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('gulp-uglify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    browserSync = require('browser-sync').create(),
    argv = require('yargs').argv;
var OUTPUT_JS_FILE = 'app.js',
    OUTPUT_JS_PATH = path.resolve(__dirname, 'public/js/'),
    INPUT_JS_FILE = path.resolve(__dirname, 'src/js/app.js');



function bundleFiles(bundler) {
    return bundler
        .bundle()
        .on('error', gulpUtil.log)
        .pipe(source(OUTPUT_JS_FILE))
        .pipe(gulpif('production', buffer()))
        .pipe(gulpif('production', uglify()))
        .pipe(gulp.dest(OUTPUT_JS_PATH))
        .pipe(browserSync.stream());
}

function browsers() {
    browserSync.init({
        server: path.resolve(__dirname, "./public"),
        port: process.env.PORT || "6081",
        logFileChanges: false,
        browser: "google chrome"
    });
}



function styles() {
   return  gulp.src('src/sass/**/*.scss')
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass({
            sourceComments: !production,
            outputStyle: production ? 'compressed' : 'nested'
        }))
        .on('error', gulpUtil.log)
        .pipe(gulpif(!production, sourcemaps.write({
            'includeContent': false,
            'sourceRoot': '.'
        })))
        .pipe(gulp.dest('public/css/'))
        .pipe(gulpif(!production, browserSync.stream()) );
}


var production = !!argv.production;

gulp.task('js', function() {
    console.log(INPUT_JS_FILE);
    var brws = browserify(INPUT_JS_FILE, {
        debug: !production,
    });
    return bundleFiles(brws);
});

gulp.task('watchjs', function() {
    var watcher = watchify(browserify(INPUT_JS_FILE, watchify.args));
    bundleFiles(watcher);
    watcher.on('update', function() {
        bundleFiles(watcher);
    })
    watcher.on('log', gulpUtil.log);
    browsers();
});

gulp.task('reloadStyles', function() {
    styles();
});


gulp.task('watch', ['watchjs', 'styles'], function() {
    gulp.watch('src/js/**/*.js', ['watchjs']);
    gulp.watch('src/sass/**/*.scss', ['reloadStyles']);
});



gulp.task('styles', function() {
   return  styles();
});

gulp.task('default', ['js', 'styles']);
