const { Article, Comment, Message, Motto, Setting } = require('./db') // 数据库模型
const gravatar = require('gravatar') // gravatar头像

// 返回avatar头像
function getAvatar(email) {
	return gravatar.url(email, {s: '200', r: 'g', d: 'retro'}, true)
}

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
	return new Promise(function(resolve, reject){
		Setting.fetchInfo(function(err, info) {
			if(err) reject(err);
			resolve({
				title: info.title,
				description: info.description,
				meta_keywords: info.meta_keywords,
				meta_description: info.meta_description,
			})
		})
	})
}

function GetArticleTypes() {
	return new Promise(function(resolve, reject){
		Article.fetchType(function(err, navs) {
			if(err) reject(err)
			resolve({ navs })
		})
	})
}

function GetArticleTags() {
	return new Promise(function(resolve, reject){
		Article.fetchTags(function(err, tags) {
			if(err) reject(err)
			resolve({ tags })
		})
	})
}

function GetRandomMotto() {
	return new Promise(function(resolve, reject){
		Motto.fetchAll(function(err, mottos) {
			if(err) reject(err)
			var random = Math.floor(Math.random() * mottos.length)
			var motto = mottos[random].motto
			resolve({motto})
		})
	})
}

// 获取博客的通用数据
function GetCommon(callback) {
	Promise.all([GetBlogInfo({}), GetArticleTypes({}), GetArticleTags({}), GetRandomMotto({})])
	.then(function(resolve) {
		var d = {}
		for(let item of resolve) { d = Object.assign(d, item) }
		callback && callback(d)
	})
	.catch(function(reject) {
		console.log(reject)
	})
}

// 获取本地UserCookie
function loadUserCookie(request) {
	const user = {}

	if(request.cookies.user) {
		var cookieUser = request.cookies.user
		user.nickname = cookieUser.nickname
		user.email = cookieUser.email
		user.link = cookieUser.link
	}

	return user
}

// 格式化留言信息或文章评论
async function formatReply(type, messages) {
	var messages = JSON.parse(JSON.stringify(messages))
	for(let item of messages) {
		item.avatar = getAvatar(item.email)
		item.datetime = moment(item.datetime).format('YYYY-MM-DD HH:mm:ss')

		if(item.replyid) {
			item = await loadReply(type, item)
		}else {
			item.replyname = '';
			item.replycontent = '';
		}
	}

	return messages
}

// 加载留言回复或文章评论回复
function loadReply(type, message) {
	var model = ''
	if(type === 'comment') model = Comment
	if(type === 'message') model = Message
	if(!model) return
	return new Promise(function(resolve, reject) {
		model.fetchById(message.replyid, (err, replyMessage) => {
			if(err) reject(err)
			message.replyname = replyMessage.nickname
			message.replycontent = replyMessage.content
			resolve(message)
		})
	})
}

module.exports = { getAvatar, createPage, GetCommon, loadUserCookie, formatReply  }