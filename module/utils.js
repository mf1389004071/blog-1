const { Article, Motto, Setting } = require('./db') // 数据库模型
const gravatar = require('gravatar') // gravatar头像

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

// 返回avatar头像
function getAvatar(email) {
	return gravatar.url(email, {s: '200', r: 'g', d: 'retro'}, true)
}

module.exports = { createPage, GetCommon, getAvatar }