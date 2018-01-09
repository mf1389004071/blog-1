
var
https 	    = require('https'), 		// 服务器模块
fs 			= require('fs'), 			// 文件操作模块
url 		= require('url'), 			// url处理模块
querystring = require('querystring'), 	// 参数处理模块
express 	= require('express'), 		// express 框架
bodyParser 	= require('body-parser'),  	// 获取post数据
cookieParser= require('cookie-parser'),	// 用来弄cookie 的
mongoose    = require('mongoose');		// 操作数据库

// 连接数据库
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/miiiku', { useMongoClient: true })
// mongoose.connect('mongodb://localhost/miiiku', { user: 'xxx', pass: 'xxx', useMongoClient: true })

var port = process.env.PORT || 8000
var app = express()

// 不加这一行代码 （貌似cookie不会保存 所以获取不到cookie）
app.use(cookieParser());

// 设置静态资源目录
app.use(express.static('assets'))
app.use(express.static('html'))

// 视图根目录
app.set('views', './views')

// 默认的模板引擎
app.set('view engine', 'pug')

// 表单格式化 用来获取post参数 不然获取不到
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// 设置https
var options = {
    key: fs.readFileSync('cert/214306452260030.key'),
    cert: fs.readFileSync('cert/214306452260030.pem')
}

// 监听端口
https.createServer(options, app).listen(port, function() {
    console.log('Web Server Start PORT:' + port)
});


// 引入路由
var routerIndex = require('./routes/index')
var routerAPI = require('./routes/api')

app.use('/', routerIndex)
app.use('/api/', routerAPI)



// 404 这个一定要放在最后面
app.get('*', function(req, res) {
	routerIndex.GetCommon(data => {
		res.render('page/404', data)
	})
})