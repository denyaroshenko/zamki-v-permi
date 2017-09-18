var concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    cssmin = require('gulp-cssmin'), // минификация css
    imagemin = require('gulp-imagemin'), // минификация картинок
    less = require('gulp-less'), //компиляция LESS
    prefixer = require('gulp-autoprefixer'), // расставление автопрефиксов
    rename = require('gulp-rename'), // переименование
    sourcemaps = require('gulp-sourcemaps'), // sourcemaps
    stylus = require('gulp-stylus'), // препроцессор stylus
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    useref = require('gulp-useref'),
    watch = require('gulp-watch'), //расширение возможностей watch
    gulp = require('gulp');

var path = {
    build: { //Куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/assets/js/',
        css: 'dist/assets/css/',
        img: 'dist/assets/img/',
        fonts: 'dist/assets/fonts/',
        htaccess: 'dist/'
    },
    src: { //Пути откуда брать исходники
        html: 'app/*.html', //Синтаксис app/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/*.js',
        less: 'app/less/**/*.less',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*',
        htaccess: 'app/.htaccess'
    },
    watch: { //За изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        css: 'app/css/**/*.*',
        img: 'appimg/**/*.*',
        fonts: 'app/fonts/**/*.*',
        htaccess: 'app/.htaccess'
    },
    clean: './dist', //директории которые могут очищаться
    outputDir: './dist' //исходная корневая директория для запуска минисервера
};

// Локальный сервер для разработки
gulp.task('connect', function(){
    connect.server({ //настриваем конфиги сервера
        root: [path.outputDir], //корневая директория запуска сервера
        port: 9999, //какой порт будем использовать
        livereload: true //инициализируем работу LiveReload
    });
});

// билдим html
gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.html)) //выгрузим их в папку build
        .pipe(connect.reload()) //И перезагрузим наш сервер для обновлений
});

// конвертируем LESS в CSS
gulp.task('css:build', function() {
  gulp.src(path.src.less)
  	//Конвертируем LESS в CSS
    .pipe(less())

    //Добавим вендорные префиксы
    .pipe(prefixer({
        browsers: ['last 3 version', "> 1%", "ie 8", "ie 7"]
    }))

    .pipe(sourcemaps.init()) //инициализируем soucemap
    .pipe(sourcemaps.write()) //пропишем sourcemap

    //минифицируем css
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))

    .pipe(gulp.dest(path.build.css)) //выгрузим файлы
    .pipe(connect.reload()) //перезагрузим сервер
});

// Объединение и минификация JS
gulp.task("js:build", function() {
  return gulp.src(path.src.js)
    .pipe(rename("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(connect.reload())
});

//Оптимизация изображений
gulp.task('img:min', () =>
	gulp.src(path.src.img)
		.pipe(imagemin())
		.pipe(gulp.dest(path.build.img))
);

// билдим все
gulp.task('build', [
    'html:build',
    'css:build',
    'js:build',
    'img:min'
]);

//Слежение за файлмаи
gulp.task('watch', function() {
    gulp.watch(path.src.html, ['html:build']);
    gulp.watch(path.src.less,['css:build']);
    gulp.watch(path.src.js, ['js:build']);
    gulp.watch(path.watch.img, ['img:min']);
});

// действия по умолчанию
gulp.task('default', ['build', 'watch', 'connect']);