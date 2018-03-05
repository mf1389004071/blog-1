var
fs              = require('fs'),                // 文件操作模块
querystring     = require('querystring'),       // 参数处理模块
express         = require('express'),           // express 框架
moment          = require('moment'),            // 时间格式化
model           = require('../mongoose/model'), // 数据库模型
email           = require('../module/email');   // 发送邮件

var router 		= express.Router();

router.get('/message/page/:page', function(req, res) {
	let page = req.params.page;

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
			item = item.replyid ? await loadReply(item) : item
		}
		
		res.render('part/loadMessage', {
			data: messages
		})
	}

	model.Message.fetch(null, 1, page, function(err, messages) {
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
		avatar: message.avatar,
		link: message.link
	}

	var creatMessage = new model.Message({
		nickname: message.nickname,
		qq: message.avatar,
		link: message.link,
		content: message.content,
		replyid: message.replyid,
		state: 0
	})

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
		messages.avatar = getAvatar(messages.qq);
		messages.time = moment(messages.datetime).format('YYYY-MM-DD HH:mm:ss');

		messages = messages.replyid ? await loadReply(messages) : messages
		
		res.render('part/creatMessage', { data: messages });
	}

	res.cookie('user', user, { maxAge: 1000 * 60 * 60 * 24 *30, httpOnly: true })

	creatMessage.save(function(err, messageUpdate) {
		if(err) res.send(err)

		messageUpdate.time = moment(messageUpdate.datetime).format('YYYY-MM-DD HH:mm:ss')
		messageUpdate.avatar = getAvatar(messageUpdate.qq);

		email.sendEmail({
			sendee: '81085036@qq.com',
			subject: '《我在这里 - 有新的留言》',
			text: '有新的留言！',
			html: '<p>留言人:' + messageUpdate.nickname + '</p><p>留言内容：' + messageUpdate.content + '</p><p>留言时间：' + messageUpdate.datetime + '</p>'
		})

		asyncReply(messageUpdate)
	})
})

// 返回QQ头像
function getAvatar(QQ) {
	return '//q1.qlogo.cn/g?b=qq&nk=' + QQ + '&s=100&t=' + new Date().getTime()
}

module.exports = router