var
model           = require('../mongoose/model'), // 数据库模型
gravatar 		= require('gravatar'); 			// gravatar头像

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

// 返回avatar头像
function getAvatar(email) {
	return gravatar.url(email, {s: '200', r: 'g', d: 'retro'}, true)
}


module.exports = { createPage, GetCommon, getAvatar }