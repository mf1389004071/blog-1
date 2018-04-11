const https 	    = require('https') 		    // 服务器模块
const fs 			= require('fs') 			// 文件操作模块
const url 		    = require('url') 			// url处理模块
const querystring   = require('querystring') 	// 参数处理模块
const express 	    = require('express') 		// express 框架
const bodyParser 	= require('body-parser')  	// 获取post数据
const cookieParser  = require('cookie-parser')	// 用来弄cookie 的
const moment        = require('moment')         // 时间格式化
const mongoose      = require('mongoose')		// 操作数据库
const utils         = require('./module/utils') // 工具

// 引入路由
const routerIndex   = require('./routes/index')
const routerAPI     = require('./routes/api')

const port = process.env.PORT || 8000
const app = express()


global.moment     	= moment
global.pageNumber	= 5 // 前台分页条数
global.pageOffSet 	= 2 // 页码偏移量

// 连接数据库
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/miiiku')
// mongoose.connect('mongodb://localhost/miiiku', { user: 'xxx', pass: 'xxx' })

// 视图根目录
app.set('views', './views')

// 默认的模板引擎
app.set('view engine', 'pug')

// 不加这一行代码 （貌似cookie不会保存 所以获取不到cookie）
app.use(cookieParser())

// 设置静态资源目录
app.use(express.static('assets'))
app.use(express.static('html'))

// 表单格式化 用来获取post参数 不然获取不到
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routerIndex)
app.use('/api/', routerAPI)

// 404 这个一定要放在最后面
app.get('*', function(req, res) {
	utils.GetCommon(data => { res.render('page/404', data) })
})

// 监听端口
https.createServer({
    key: fs.readFileSync('cert/214306452260030.key'),
    cert: fs.readFileSync('cert/214306452260030.pem'),
}, app).listen(port, () => { console.log('Web Server Start PORT:' + port) })
