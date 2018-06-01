// load plugins
const del 		= require('del')
const gulp 		= require('gulp')
const sass 		= require('gulp-sass')
const notify 	= require('gulp-notify')
const px2rem 	= require('gulp-px2rem')
const autoprefixer = require('gulp-autoprefixer')


// 清除文件任务
gulp.task('clean', function(cb) {
	del(['assets/css/*.css'], cb)
})


// 编译css任务
gulp.task('css', function() {
	return gulp.src('style/*.scss')
	// 编译 编译输出形式为expanded
	.pipe(sass({outputStyle: 'expanded'}))
	// 添加前缀
	.pipe(autoprefixer())
	// px转rem
	.pipe(px2rem())
	// 保存到指定目录
	.pipe(gulp.dest('assets/css/'))
	// 提示任务完成！
	.pipe(notify({message: 'Style task complete!'}))
})

// 默认命令
gulp.task('default', gulp.series(gulp.parallel('clean', 'css')), function() {
	console.log('statr default task!');
})


// 监听文件发生改变进行css编译
gulp.watch('style/*.scss', gulp.parallel('default')).on('change', function(e) {
	console.log('style/*.scss 被改变 开始编译！');
})