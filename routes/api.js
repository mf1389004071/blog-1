const fs            = require('fs')               	// 文件操作模块
const querystring   = require('querystring')      	// 参数处理模块
const express       = require('express')          	// express 框架
const email         = require('../module/email')  	// 发送邮件
const utils 		= require('../module/utils')	// 工具
const { Message } 	= require('../module/db')		// 数据库模型

var router 			= express.Router()

router.get('/message/page/:page', function(req, res) {
	var page = req.params.page

	var loadReply = function(message) {
		return new Promise(function(resolve, reject) {
			Message.fetchById(message.replyid, (err, replyMessage) => {
				if(err) reject(err)
				message.replyname = replyMessage.nickname
				message.replycontent = replyMessage.content
				resolve(message)
			})
		})
	}

	var asyncReply = async function formatReply (messages) {
		var messages = JSON.parse(JSON.stringify(messages))
		for(let item of messages) {
			item.avatar = utils.getAvatar(item.email)
			item.datetime = moment(item.datetime).format('YYYY-MM-DD HH:mm:ss')
			item = item.replyid ? await loadReply(item) : item
		}
		
		res.render('part/loadMessage', { data: messages })
	}

	Message.fetch({ state: true, page }, function(err, messages) {
        if(err) return res.send(err)
        if(!messages || messages.length < 1) return res.send(null)
		asyncReply(messages)
	})
})

router.post('/message/add', function(req, res) {
	var message = querystring.parse(req.body.message)

	if(message.link.indexOf('http') < 0 && message.link != '') message.link = 'http://' + message.link
	
	var user = {
		nickname: message.nickname,
		email: message.email,
		link: message.link
	}

	var loadReply = function(message) {
		return new Promise(function(resolve, reject) {
			Message.fetchById(message.replyid, (err, replyMessage) => {
				if(err) reject(err)
				message.replyname = replyMessage.nickname
				message.replycontent = replyMessage.content
				resolve(message)
			})
		})
	}

	var asyncReply = async function formatReply (messages) {
		messages.avatar = utils.getAvatar(messages.email);
		messages.time = moment(messages.datetime).format('YYYY-MM-DD HH:mm:ss');

		messages = messages.replyid ? await loadReply(messages) : messages
		
		res.render('part/creatMessage', { data: messages });
	}

	res.cookie('user', user, { maxAge: 1000 * 60 * 60 * 24 *30, httpOnly: true })

	new Message(message).save(function(err, messageUpdate) {
		if(err) res.send(err)
		email.sendEmail({
			sendee: '81085036@qq.com',
			subject: '《我在这里 - 有新的留言》',
			text: '有新的留言！',
			html: `
				<p>留 言 人 : ${messageUpdate.nickname}</p>
				<p>留言内容	：${messageUpdate.content}</p>
				<p>留言时间	：${messageUpdate.datetime}</p>
			`
		})
		asyncReply(messageUpdate)
	})
})

module.exports = router