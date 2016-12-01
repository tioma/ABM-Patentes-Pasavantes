/**
 * Created by kolesnikov-a on 19/10/2016.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var htmlReplace = require('gulp-html-replace');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

gulp.task('clean-css', function(){

    gulp.src(['css/app.css', 'css/bootstrap.css'])
        .pipe(cleanCss({processImport: false}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/css/'))
});

gulp.task('html-replace', function(){
    var indexFiles = {
        "administrador-pasavantes": "administrador-pasavantes/index.php",
        "administrador-patentes": "administrador-patentes/index.php"
    };

    for (var html in indexFiles){
        gulp.src(indexFiles[html])
            .pipe(htmlReplace({
                'css': {
                    src: ['../css/bootstrap.min.css', '../css/app.min.css', '../css/animate.min.css']
                },
                'bower': {
                    src: ['../lib/angular/angular.min.js',
                        '../lib/angular-animate/angular-animate.min.js',
                        '../lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                        '../lib/angular-local-storage/angular-local-storage.min.js',
                        '../lib/angular-ui-router/angular-ui-router.min.js'
                    ]
                },
                'app': 'app-min.js'
            }))
            .pipe(gulp.dest('build/' + html));

    }
});

gulp.task('copy-files', function(){
    var templates = {
        "administrador-pasavantes/view": "administrador-pasavantes/view/*.html",
        "administrador-pasavantes/service/dialogs": "administrador-pasavantes/service/dialogs/*.html",
        "administrador-patentes/view": 'administrador-patentes/view/*.html',
        "administrador-patentes/service/dialogs": "administrador-patentes/service/dialogs/*.html",
        "css": "bower_components/animate.css/animate.min.css",
        "fonts": "fonts/*"
    };
    for (var template in templates) {
        gulp.src(templates[template])
            .pipe(gulp.dest("build/" + template))
    }
});

gulp.task("copy-bower-dependencies", function () {

    var paths = {
        bower: "bower_components/",
        lib: "build/lib/"
    };

    var bower = {
        "angular": "angular/*.min*",
        "angular-animate": 'angular-animate/*.min*',
        "angular-bootstrap": 'angular-bootstrap/*-tpls.min*',
        "angular-local-storage": 'angular-local-storage/dist/*.min*',
        "angular-ui-router": 'angular-ui-router/release/*.min*'
    };

    for (var destinationDir in bower) {
        gulp.src(paths.bower + bower[destinationDir])
            .pipe(gulp.dest(paths.lib + destinationDir));
    }
});

gulp.task('compress-pasavantes', function(){
    gulp.src(['administrador-pasavantes/*.js', 'administrador-pasavantes/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(minify({ noSource: true }))
        .pipe(gulp.dest('build/administrador-pasavantes/'))
});

gulp.task('compress-patentes', function(){
    gulp.src(['administrador-patentes/*.js', 'administrador-patentes/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(minify({ noSource: true }))
        .pipe(gulp.dest('build/administrador-patentes'))
});

gulp.task('default', ['clean-css', 'html-replace', 'copy-files', 'copy-bower-dependencies', 'compress-pasavantes', 'compress-patentes']);