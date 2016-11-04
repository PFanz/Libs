var releaseUrl = '"dist/'

var gulp = require('gulp')
var replace = require('gulp-replace')
var gutil = require('gulp-util')
var plumber = require('gulp-plumber') // 防止错误打断
var sourcemaps = require('gulp-sourcemaps')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var cleanCSS = require('gulp-clean-css')
var postcss = require('gulp-postcss')
var webpack = require('webpack-stream')
// var babel = require('gulp-babel')
// var uglify = require('gulp-uglify')
var imagemin = require('gulp-imagemin')
var browserSync = require('browser-sync').create()

// 出错回调函数
var errorHandler = (e) => {
  gutil.beep()
  gutil.log(e)
}

// postcss 配置
var processors = [
  require('cssgrace')
]

// css
gulp.task('sass', function () {
  gulp.src('src/sass/*.scss')
    .pipe(plumber({errorHandler: errorHandler}))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'Firefox > 20', 'ios 6', 'android >= 4.0', 'IE 8'],
      remove: false
    }))
    .pipe(postcss(processors))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}))
})

// 压缩JS
gulp.task('jsMin', function () {
  // jslib 直接移动
  gulp.src('src/libs/**')
    .pipe(gulp.dest('dist/libs'))
  // js
  gulp.src('src/js/*.js')
    .pipe(plumber({errorHandler: errorHandler}))
    // .pipe(sourcemaps.init())
    // .pipe(babel())
    // 使用webpack
    .pipe(webpack(require('./webpack.config.js')))
    // .pipe(uglify())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js/'))
})

// 压缩图片
gulp.task('imageMin', function () {
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
})

// html
gulp.task('releaseHtml', function () {
  gulp.src('./*.html')
    .pipe(replace(/"dist\//g, releaseUrl))
    .pipe(gulp.dest('dist/'))
})

// browser-sync服务
gulp.task('serve', ['sass', 'jsMin', 'imageMin'], function () {
  browserSync.init({
    server: './'
  })
  gulp.watch('src/sass/*.scss', ['sass'])
  gulp.watch('src/js/*.js', ['jsMin']).on('change', browserSync.reload)
  gulp.watch('src/images/*', ['imageMin']).on('change', browserSync.reload)
  gulp.watch('*.html', ['jsMin', 'sass', 'imageMin', 'releaseHtml', 'serve']).on('change', browserSync.reload)
})

gulp.task('default', ['jsMin', 'sass', 'imageMin', 'releaseHtml', 'serve'])
