var
fs              = require('fs'),                // 文件操作模块
querystring     = require('querystring'),       // 参数处理模块
express         = require('express'),           // express 框架
marked          = require('marked'),            // 解析markdown文件
moment          = require('moment'),            // 时间格式化
model           = require('../mongoose/model'), // 数据库模型
email           = require('../module/email');   // 发送邮件

var router 		= express.Router();

global.pageNumber	= 5 						// 前台分页条数
global.pageOffSet 	= 2 						// 页码偏移量

function fetchArticle(param, page, url, success, error) {

	var getCount = function () {
		var promise = new Promise(function(resolve, reject) {
			model.Article.count(param, (err, count) => {
				if(err) reject(err)
				let HTMLPage = createPage(page, count, url)
				resolve({ HTMLPage })
			})
		})

		return promise
	}

	var getArticle = function() {
		var promise = new Promise(function(resolve, reject){
			model.Article.fetch(param, page, (err, articles) => {
				if(err) reject(err)
				articles.forEach(function(item, index) { item.time = moment(item.datetime).format('YYYY-MM-DD') })
				resolve({ articles })
			})
		})

		return promise
	}

	Promise.all([getCount(), getArticle()])
	.then(function(resolve) {
		GetCommon(result => {
			let data = result
			resolve.forEach(function(item, index) { data = Object.assign(data, item) })
			success && success(data)
		})
	})
	.catch(function(reject) { error && error(reject) })
}

// index page
router.get('/', function(req, res) {
	let page = 1

	fetchArticle({}, page, '', data => {
		res.render('page/index', data)
	}, error => {
		res.send(error)
	})
})

router.get('/page/:page', function(req, res) {
	let page = req.params.page
	
	fetchArticle({}, page, '', data => {
		res.render('page/index', data)
	}, error => {
		res.send(error)
	})
})

// category articlelist
router.get('/category/:type', function(req, res) {
	let type = req.params.type
	let page = 1
	
	fetchArticle({ type }, page, '/category/' + type, data => {
		res.render('page/index', data)
	}, error => {
		res.send(error)
	})
	
})

router.get('/category/:type/page/:page', function(req, res) {
	let type = req.params.type
	let page = req.params.page
	
	fetchArticle({ type }, page, '/category/' + type, data => {
		res.render('page/index', data)
	}, error => {
		res.send(error)
	})
})

// tag articlelist
router.get('/tag/:tag', function(req, res) {
	let tag = req.params.tag
	let page = 1
	
	fetchArticle({ tag }, page, '/tag/' + tag, data => {
		res.render('page/index', data)
	}, error => {
		res.send(error)
	})
})

router.get('/tag/:tag/page/:page', function(req, res) {
	let tag = req.params.tag
	let page = req.params.page
	
	fetchArticle({ tag }, page, '/tag/' + tag, data => {
		res.render('page/index', data)
	}, error => {
		res.send(error)
	})
})

// index search
router.get('/search/:keyword', function(req, res) {
	let keyword = req.params.keyword
	let page = 1
	
	fetchArticle({ keyword }, page, '/search/' + keyword, data => {
		data.meta_title = keyword + ' - ' + data.title
		res.render('page/index', data)
	}, error => {
		res.send(error)
	})
})

router.get('/search/:keyword/page/:page', function(req, res) {
	let keyword = req.params.keyword
	let page = 1
	
	fetchArticle({ keyword }, page, '/search/' + search, data => {
		res.render('page/index', data)
	}, error => {
		res.send(error)
	})
})

// article page
router.get('/article/:_id', function(req, res) {
	let id = req.params._id

	let incArticle = function() {
		return new Promise(function(resolve, reject) {
			model.Article.inc(id, (err, article) => {
				if(err) reject(err)
				resolve()
			})
		})
	}

	let getArticle = function() {
		return new Promise(function(resolve, reject) {
			model.Article.findById(id, (err, article) => {
				if(err) reject(err)
				article.date = moment(article.datetime).format('YYYY-MM-DD')
				article.html = marked(article.content)
				resolve(article)
			})
		})
	}

	incArticle()
	.then(getArticle)
	.then(function(resolve) {
		GetCommon(result => {
			result.article = resolve
			res.render('page/article', result)
		})
	})
	.catch(function(reject) {
		res.render(reject)
	})
})

// articles page
router.get('/articles', function(req, res) {
	model.Article.fetchTime(function(err, articles) {
		if(err) return res.end(err)
		GetCommon(result => {
			result.meta_title = "归档 - " + result.title
			result.articles = articles
			res.render('page/articles', result)
		})
	})
})

// link page
router.get('/links', function(req, res) {
	var types = ['partner', 'tool', 'other']

	var loadLink = function(type) {
		return new Promise(function(resolve, reject) {
			model.Link.fetchAll(type, '1', (err, links) => {
				if(err) reject(err)
				resolve(links)
			})
		})
	}

	var asyncLink = async function getLink() {
		var links = {}
		for(let item of types) {
			links[item] = await loadLink(item)
		}

		GetCommon(result => {
			result.meta_title = '友链 - ' + result.title
			result.links = links
			res.render('page/link', result)
		})
	}

	asyncLink()
})

// message page
router.get('/message', function(req, res) {
	let page = 1
	let user = {}

	if(req.cookies.user) {
		var cookieUser = req.cookies.user
		user = {
			nickname: cookieUser.nickname,
			avatar: cookieUser.avatar,
			link: cookieUser.link
		}
	}

	var loadReply = function(message) {
		return new Promise(function(resolve, reject) {
			model.Message.fetchById(message.replyid, (err, replyMessage) => {
				if(err) reject(err)
				message.replyname = replyMessage.nickname
				message.replycontent = replyMessage.content
				resolve(message)
			})
		})
	}

	var asyncReply = async function formatReply (messages) {
		for(let item of messages) {
			item.avatar = getAvatar(item.qq);
			item.time = moment(item.datetime).format('YYYY-MM-DD HH:mm:ss');

			if(item.replyid) {
				item = await loadReply(item)
			}else {
				item.replyname = '';
				item.replycontent = '';
			}
		}

		GetCommon(result => {
			result.meta_title = '留言 - ' + result.title
			result.messages = messages
			result.user = user
			res.render('page/message', result)
		})
	}

	model.Message.fetch(null, 1, page, function(err, messages) {
		if(err) return res.send(err)
		asyncReply(messages)
	})
})

// about page
router.get('/about', function(req, res) {
	GetCommon(result => {
		let about = marked(fs.readFileSync('./html/about.md', 'utf8'));
		result.meta_title = '关于 - ' + result.title
		result.html = about
		res.render('page/about', result)
	})
})

// message pagenumber
router.get('/message/page/:page', function(req, res) {
	let page = req.params.page;

	model.Message.fetch(null, 1, page, pageNumber, function(err, messages) {
		if(err) {
            console.log(err)
            res.send(err)
		}
		if(messages) {
            if(messages.length < 1) {
                res.send("");
                return;
            }

			// 处理头像
			var messageslength = messages.length;
			messages.forEach(function(item, index) {
				item.avatar = getAvatar(item.qq);
				item.time = moment(item.datetime).format('YYYY-MM-DD HH:mm:ss');
				if(item.replyid) {
					model.Message.fetchById(item.replyid, function(err, message) {
						messageslength --;
						if(err) console.log(err)
						if(message) {
							item.replyname = message.nickname;
							item.replycontent = message.content;
						}
						if(messageslength <= 0) {
                            res.render('part/addMessage', {
                                data: messages
                            })
						}
					})
				}else {
					messageslength --;
					item.replyname = '';
					item.replycontent = '';
					if(messageslength <= 0) {
                        res.render('part/addMessage', {
                            data: messages
                        })
					}
				}
			})
        }
	})
})

// insert message
router.post('/message/add', function(req, res) {
	// req.query 获取的是url ？号后面的参数
	var data = req.body.data;
	// 获取到的数据是url字符串 需要转换为对象
	data = querystring.parse(data)
	if(data.link.indexOf('http') < 0 && data.link != '') data.link = 'http://' + data.link
	var cookieUser = {
		nickname: data.nickname,
		avatar: data.avatar,
		link: data.link
	}

	res.cookie('wzzlUser', cookieUser, { maxAge: 1000 * 60 * 60 * 24 *30, httpOnly: true })

	var newMessage = new model.Message({
		nickname: data.nickname,
		qq: data.avatar,
		link: data.link,
		content: data.content,
		state: 0,
		replyid: data.replyid
	})

	newMessage.save(function(err, messageUpdate) {
		if(err) console.log(err);
		if(messageUpdate) {
			messageUpdate.time = moment(messageUpdate.datetime).format('YYYY-MM-DD HH:mm:ss')
			messageUpdate.avatar = getAvatar(messageUpdate.qq);

			var option = {
				sendee: '81085036@qq.com',
				subject: '《我在这里》 有新的留言， 请注意查收！',
				text: '有新的留言！',
				html: '<p>留言人:' + messageUpdate.nickname + '</p><p>留言内容：' + messageUpdate.content + '</p><p>留言时间：' + messageUpdate.datetime + '</p>'
			}
			email.sendEmail(option);

			if(data.replyid) {
				model.Message.fetchById(messageUpdate.replyid, function(err, message) {
					if(err) console.log(err)
					if(message) {
						messageUpdate.replyname = message.nickname;
						messageUpdate.replycontent = message.content;
						res.render('part/newMessage', { data: messageUpdate });
					}
				})
			}else {
				res.render('part/newMessage', { data: messageUpdate });
			}
		}
	})
})


// 返回playlist
router.get('/musiclist', function(req, res) {
	let resultJSON = JSON.parse(fs.readFileSync('./html/musiclist.json'))
	if(resultJSON) {
		res.send(resultJSON)
	}else {
		res.send('')
	}
})


// 设置分页
function createPage(page, countNumber, url) {

	if(typeof page != 'number') page = Number(page)

	var countPage = Math.ceil(countNumber / pageNumber)

	if(countPage <= 1) countPage = 1;

	var first = '', numberPageL = '', numberPage = '', numberPageR = '', last = '';

	first = "<li><a type='ajax_a' href='" + url + "/page/1'>first</a></li>"

	last = "<li><a type='ajax_a' href='" + url + "/page/" + countPage + "'>last</a></li>"

	for(var i = pageOffSet; i >= 1; i--) {
		var tempNumberL = page - i
		if(tempNumberL < 1) continue
		numberPageL += "<li><a type='ajax_a' href='" + url + "/page/"+ tempNumberL +"' data-page='" + tempNumberL + "'>" + tempNumberL + "</a></li>"
	}

	numberPage = "<li><a href='javascript:;' class='active'>" + page + "</a></li>"

	for(var i = 1; i <= pageOffSet; i++) {
		var tempNumberR = page + i
		if(tempNumberR > countPage) continue
		numberPageR += "<li><a type='ajax_a' href='" + url + "/page/" + tempNumberR + "'>" + tempNumberR + "</a></li>"
	}

	return "<ul class='page-content'>" + first + numberPageL + numberPage + numberPageR + last + "</ul>";
}

function GetBlogInfo() {
	var promise = new Promise(function(resolve, reject){
		model.Config.fetchInfo(function(err, info) {
			if(err) reject(err);
	
			resolve({
				title: info.title,
				description: info.description
			});
		})
	})

	return promise;
}

function GetBlogMeta() {
	var promise = new Promise(function(resolve, reject){
		model.Config.fetchMeta(function(err, meta) {
			if(err) reject(err);
	
			resolve({
				meta_keywords: meta.meta_keywords,
				meta_description: meta.meta_description
			});
		})
	})

	return promise;
}

function GetGroupNav() {
	var promise = new Promise(function(resolve, reject){
		model.Article.groupNav(function(err, navs) {
			if(err) reject(err);
			resolve({ navs });
		})
	})

	return promise;
}

function GetGroupTags() {
	var promise = new Promise(function(resolve, reject){
		model.Article.groupTags(function(err, tags) {
			if(err) reject(err);
			resolve({ tags })
		})
	})

	return promise;
}

function GetRandomMotto() {
	var promise = new Promise(function(resolve, reject){
		model.Motto.fetchAll(function(err, mottos) {
			if(err) reject(err)
			var random = Math.floor(Math.random() * mottos.length)
			var motto = mottos[random].motto
			resolve({motto})
		})
	})
	return promise;
}

// 获取博客的通用数据
function GetCommon(callback) {
	Promise.all([GetBlogInfo({}), GetBlogMeta({}), GetGroupNav({}), GetGroupTags({}), GetRandomMotto({})])
	.then(function(resolve) {
		var d = {}
		for(let item of resolve) { d = Object.assign(d, item) }
		callback && callback(d)
	})
	.catch(function(reject) {
		console.log(reject)
	})
}

// 返回QQ头像
function getAvatar(QQ) {
	return '//q1.qlogo.cn/g?b=qq&nk=' + QQ + '&s=100&t=' + new Date().getTime()
}

module.exports = router
module.exports.GetCommon = GetCommon
