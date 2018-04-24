const fs            = require('fs')               	// 文件操作模块
const querystring   = require('querystring')      	// 参数处理模块
const express       = require('express')          	// express 框架
const email         = require('../module/email')  	// 发送邮件
const utils 		= require('../module/utils')	// 工具
const { Article, Comment, Message } 	= require('../module/db')		// 数据库模型

var router 			= express.Router()

router.get('/message/page/:page', function(req, res) {
	var page = req.params.page

	Message.fetch({ state: true, page }, function(err, messages) {
        if(err) return res.send(err)
        if(!messages || messages.length < 1) return res.send(null)
		utils.formatReply('message', messages).then(formatMessages => {
			res.render('part/loadMessage', { data: formatMessages })
		})
	})
})

router.post('/message/add', function(req, res) {
	var message = querystring.parse(req.body.message)
	var user = utils.loadUserCookie(req)

	if(message.link.indexOf('http') < 0 && message.link != '') message.link = 'http://' + message.link

	res.cookie('user', user, { maxAge: 1000 * 60 * 60 * 24 *30, httpOnly: true })

	new Message(message).save(function(err, newMessage) {
		if(err) console.log(err)
		
		email.sendEmail({
			sendee: '81085036@qq.com',
			subject: '我在这里 - 有新的留言，请注意查看',
			text: '我在这里 - 有新的留言，请注意查看',
			html: `
				<p><b>${newMessage.nickname}</b>给你发表了新的留言！</p>
				<p>留言内容为：<b>${newMessage.content}</b></p>
				<p>留言时间为：<b>${newMessage.datetime}</b></p>
				<p>请注意查看！</p>
			`
		})

		utils.formatReply('message', [newMessage]).then(formatMessage => {
			res.render('part/creatMessage', { data: formatMessage[0] })
		})
	})
})

router.get('/comment/:id/:page', function(req, res) {
	var id = req.params.id
	var page = req.params.page

	Comment.fetch({ articleid: id, state: true, page }, function(err, comments) {
        if(err) return res.send(err)
		if(!comments || comments.length < 1) return res.send(null)
		utils.formatReply('comment', comments).then(formatComments => {
			res.render('part/loadMessage', { data: formatComments })
		})
	})
})

router.post('/comment/add', function(req, res) {
	var comment = querystring.parse(req.body.message)
	var user = utils.loadUserCookie(req)

	if(comment.link.indexOf('http') < 0 && comment.link != '') comment.link = 'http://' + comment.link
	
	res.cookie('user', user, { maxAge: 1000 * 60 * 60 * 24 *30, httpOnly: true })

	new Comment(comment).save(function(err, newComment) {
		if(err) console.log(err)
		Article.findById(comment.articleid, (err, article) => {
			if(err) console.log(err)

			email.sendEmail({
				sendee: '81085036@qq.com',
				subject: '我在这里 - 有新的评论，请注意查看',
				text: `我在这里 - 有新的评论，请注意查看`,
				html: `
					<p><b>${newComment.nickname}</b>在文章：<b>${article.title}</b>中发表了评论！</p>
					<p>评论内容为：<b>${newComment.content}</b></p>
					<p>评论时间为：<b>${newComment.datetime}</b></p>
					<p>请注意查看！</p>
				`
			})

			utils.formatReply('comment', [newComment]).then(formatComment => {
				res.render('part/creatMessage', { data: formatComment[0] })
			})
		})
	})
})

module.exports = router