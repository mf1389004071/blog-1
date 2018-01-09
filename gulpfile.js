


// load plugins
var del 	= require('del')
var gulp 	= require('gulp')
var sass 	= require('gulp-sass')
var notify 	= require('gulp-notify')


// 清除文件任务
gulp.task('clean', function(cb) {
	del(['assets/css/*.css'], cb)
})


// 编译css任务
gulp.task('css', function() {
	return gulp.src('style/*.scss')
	// 编译 编译输出形式为expanded
	.pipe(sass({outputStyle: 'expanded'}))
	// 保存到指定目录
	.pipe(gulp.dest('assets/css/'))
	// 提示任务完成！
	.pipe(notify({message: 'Style task complete!'}));
})

// 默认命令
gulp.task('default', ['clean', 'css'], function() {
	console.log('statr default task!');
})


// 监听文件发生改变进行css编译
gulp.watch('style/*.scss', ['default']).on('change', function(e) {
	console.log('style/*.scss 被改变 开始编译！');
})