const fs            = require('fs')              // 文件操作模块
const querystring   = require('querystring')     // 参数处理模块
const express       = require('express')         // express 框架
const marked        = require('marked')          // 解析markdown文件
const email         = require('../module/email') // 发送邮件
const utils 		= require('../module/utils') // 工具
const { Article, Comment, Link, Message } = require('../module/db') // 数据库模型

var router 			= express.Router()

function fetchArticle(param, url, success, error) {
	var getCount = function () {
		return new Promise(function(resolve, reject) {
			Article.count(param, (err, count) => {
				if(err) reject(err)
				let HTMLPage = utils.createPage(param.page, count, url)
				resolve({ HTMLPage })
			})
		})
	}

	var getArticle = function() {
		return new Promise(function(resolve, reject){
			Article.fetch(param, (err, articles) => {
				if(err) reject(err)
				articles = JSON.parse(JSON.stringify(articles))
				articles.forEach(function(item, index) { item.datetime = moment(item.datetime).format('YYYY-MM-DD') })
				resolve({ articles })
			})
		})
	}

	Promise.all([getCount(), getArticle()])
	.then(function(resolve) {
		utils.GetCommon(result => {
			let data = result
			resolve.forEach(function(item, index) { data = Object.assign(data, item) })
			success && success(data)
		})
	})
	.catch(function(reject) { error && error(reject) })
}

// index page
router.get('/', function(req, res) {
	fetchArticle({ page: 1 }, '', data => {
		res.render('page/index', data)
	}, error => {
		console.log(error)
	})
})

router.get('/page/:page', function(req, res) {
	fetchArticle({ page: req.params.page }, '', data => {
		res.render('page/index', data)
	}, error => {
		console.log(error)
	})
})

// category articlelist
router.get('/category/:type', function(req, res) {
	var type = req.params.type
	
	fetchArticle({ type, page: 1 }, '/category/' + type, data => {
		data.title = type + ' - ' + data.title
		res.render('page/index', data)
	}, error => {
		console.log(error)
	})
	
})

router.get('/category/:type/page/:page', function(req, res) {
	var type = req.params.type
	var page = req.params.page
	
	fetchArticle({ type, page }, '/category/' + type, data => {
		data.title = type + ' - ' + data.title
		res.render('page/index', data)
	}, error => {
		console.log(error)
	})
})

// tag articlelist
router.get('/tag/:tag', function(req, res) {
	var tag = req.params.tag
	fetchArticle({ tag, page: 1 }, '/tag/' + tag, data => {
		data.title = tag + ' - ' + data.title
		res.render('page/index', data)
	}, error => {
		console.log(error)
	})
})

router.get('/tag/:tag/page/:page', function(req, res) {
	let tag = req.params.tag
	let page = req.params.page
	
	fetchArticle({ tag, page }, '/tag/' + tag, data => {
		data.title = tag + ' - ' + data.title
		res.render('page/index', data)
	}, error => {
		console.log(error)
	})
})

// index search
router.get('/search/:keyword', function(req, res) {
	let keyword = req.params.keyword
	
	fetchArticle({ keyword, page: 1 }, '/search/' + keyword, data => {
		data.title = keyword + ' - ' + data.title
		res.render('page/index', data)
	}, error => {
		console.log(error)
	})
})

router.get('/search/:keyword/page/:page', function(req, res) {
	let keyword = req.params.keyword
	let page = req.params.page
	
	fetchArticle({ keyword, page }, '/search/' + search, data => {
		data.title = keyword + ' - ' + data.title
		res.render('page/index', data)
	}, error => {
		console.log(error)
	})
})

// article page
router.get('/article/:_id', function(req, res) {
	var id = req.params._id
	var user = utils.loadUserCookie(req)

	let incArticle = function() {
		return new Promise(function(resolve, reject) {
			Article.inc(id, (err, article) => {
				if(err) reject(err)
				resolve()
			})
		})
	}

	let getArticle = function() {
		return new Promise(function(resolve, reject) {
			Article.findById(id, (err, article) => {
				if(err) reject(err)
				if(article) {
					article = JSON.parse(JSON.stringify(article))
					article.datetime = moment(article.datetime).format('YYYY-MM-DD')
					article.html = marked(article.content)
					resolve({ article })
				}else {
					resolve({ article: null })
				}
			})
		})
	}

	let getComment = function() {
		return new Promise(function(resolve, reject) {
			Comment.fetch({ articleid: id, state: true }, (err, comments) => {
				if(err) reject(err)
				utils.formatReply('comment', comments).then(comments => {
					resolve({ comments })
				})
			})
		})
	}

	incArticle()
	.then(function() {
		Promise.all([getArticle(), getComment()])
		.then(function(resolve) {
			utils.GetCommon(result => {
				result.user = user
				result.title = resolve[0].article.title + ' - ' + result.title
				resolve.forEach(function(item, index) { result = Object.assign(result, item) })
				res.render('page/article', result)
			})
		})
		.catch(function(reject) {
			console.log(reject)
		})
	}).catch(function(reject) {
		console.log(reject)
	})
})

// articles page
router.get('/articles', function(req, res) {
	Article.fetchTime(function(err, articles) {
		if(err) return res.end(err)
		utils.GetCommon(result => {
			result.title = "归档 - " + result.title
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
			Link.fetchAuth(type, (err, links) => {
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

		utils.GetCommon(result => {
			result.title = '友链 - ' + result.title
			result.links = links
			res.render('page/link', result)
		})
	}

	asyncLink()
})

// about page
router.get('/about', function(req, res) {
	utils.GetCommon(result => {
		let about = marked(fs.readFileSync('./html/about.md', 'utf8'));
		result.title = '关于 - ' + result.title
		result.html = about
		res.render('page/about', result)
	})
})

// message page
router.get('/message', function(req, res) {
	var user = utils.loadUserCookie(req)

	Message.fetch({ state: true }, function(err, messages) {
		if(err) return res.send(err)
		utils.formatReply('message', messages).then(messages => {
			utils.GetCommon(result => {
				result.title = '留言 - ' + result.title
				result.messages = messages
				result.user = user
				res.render('page/message', result)
			})
		})
	})
})


module.exports = router