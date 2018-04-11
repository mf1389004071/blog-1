var nodemailer = require('nodemailer')

// 创建可重用的对象使用SMTP传输转运
var transporter = nodemailer.createTransport({
    service: 'outlook',
    secure: false,
    requireTLS: true,
    auth: {
        user: 'guanquanhong@outlook.com',
        pass: 'xxxxxx',
    }
})

function sendEmail(options) {
	// Unicode符号设置电子邮件数据
	var mailOptions = {
	    from: '我在这里（站长） <guanquanhong@outlook.com>',   // 发送地址
	    to: options.sendee, 							    // 收件地址，可以多个
	    subject: options.subject, 						    // 标题
	    text: options.text, 							    // plaintext body
	    html: options.html,			 					    // html body
	}

	// 发送带有定义的传输对象的邮件
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){ return console.log(error) }
	    console.log('Message sent: ' + info.response)
	    // 关闭连接池
	    transporter.close()
	})
}

module.exports.sendEmail = sendEmail
