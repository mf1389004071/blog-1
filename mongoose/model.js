/**
 * mongoose 模型
 */

var mongoose  = require('mongoose')
var schemas   = require('./schema')

// 生成模型
var Article 	= mongoose.model('Article', schemas.ArticleSchema)
var Motto 		= mongoose.model('Motto', schemas.MottoSchema)
var Link        = mongoose.model('Link', schemas.LinkSchema)
var Message 	= mongoose.model('Message', schemas.MessageSchema)
var Config      = mongoose.model('Config', schemas.ConfigSchema, 'config')
var VisitHistory= mongoose.model('VisitHistory', schemas.VisitHistorySchema, 'visit_history')

// 抛出模型
module.exports  = { Article, Link, Motto, Message, Config, VisitHistory }
