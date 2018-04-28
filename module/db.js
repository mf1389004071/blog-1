const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  outline: String,
  type: String,
  tags: Array,
  top: Boolean,
  pageview: { type: Number, default: 0 },
  datetime: { type: Date, default: Date.now() },
})

const CommentSchema = new mongoose.Schema({
	articleid: { type: Schema.Types.ObjectId, ref: 'Article' },
	replyid: String,
	nickname: String,
	content: String,
	link: String,
	email: String,
	state: { type: Boolean, default: false },
	datetime: { type: Date, default: Date.now() },
})

const LinkSchema = new mongoose.Schema({
  name: String,
  link: String,
  cover: String,
  describe: String,
  type: String,
  state: Boolean,
  datetime: { type: Date, default: Date.now() },
})

const MottoSchema = new mongoose.Schema({
  motto: String,
  from: String,
  datetime: { type: Date, default: Date.now() },
})

const MessageSchema = new mongoose.Schema({
  nickname: String,
  content: String,
  link: String,
  email: String,
  replyid: String,
  state: { type: Boolean, default: false },
  datetime: { type: Date, default: Date.now() },
})

const SettingSchema = new mongoose.Schema({
  title: String,
  description: String,
  meta_keywords: String,
  meta_description: String,
  authorize_code: String,
})

// 为模式添加方法 （每次存储数据前都会调用这个方法）

ArticleSchema.pre('save', function(next) {
	this.datetime = Date.now()
	if(!this.outline) {
	  this.outline = this.content.substring(0, 15)
	}
	next()
})

CommentSchema.pre('save', function(next) {
	this.datetime = Date.now()
	next()
})

LinkSchema.pre('save', function(next) {
	this.datetime = Date.now()
	next()
})

MottoSchema.pre('save', function(next) {
	this.datetime = Date.now()
	next()
})

MessageSchema.pre('save', function(next) {
	this.datetime = Date.now()
	next()
})

ArticleSchema.statics = {
	inc: function(id, callback) {
		return this
		.update({_id : id}, {'$inc': {'pageview': 1}}) 	// $inc 【修改器】 1为加1
		.exec(callback)
	},
	count: function(param, callback) {
	  var option = { }
	  if(param.keyword) option.title = { $regex: param.keyword }
	  if(param.type) option.type = param.type
	  if(param.tag) option.tags = param.tag
  
	  return this
		.find(option)
		.count()
		.exec(callback)
	},
	fetch: function(param, callback) {
	  var option = { }
	  if(param.keyword) option.title = { $regex: param.keyword }
	  if(param.type) option.type = param.type
	  if(param.tag) option.tags = param.tag
		param.page = param.page || 1
  
	  return this
		.find(option)
		.limit(pageNumber)
		.skip((param.page - 1) * pageNumber)
		.sort({ 'datetime': -1 })
		.exec(callback)
	},
	fetchTop: function(callback) {
		return this
		.find({'top': true})
		.sort({'datetime': -1})
		.exec(callback)
	},
	findById: function(id, callback) {
		return this
		.findOne({_id: id})
		.exec(callback)
	},
	fetchTime: function(callback) {
		var operation = [
			{
				$group: {
					_id: { $dateToString: {format: '%Y-%m', date: '$datetime'}},
					count: { $sum: 1 },
					id: { $push: '$_id' },
					title: { $push: '$title' },
					pageview: { $push: '$pageview' }
				}
			},
			{
				$sort: {_id: -1}
			}
		]

		return this
		.aggregate(operation)
		.exec(callback)
	},
	fetchById: function(id, callback) {
		return this
		.findOne({_id: id})
		.exec(callback)
	},
	fetchType: function(callback) {
		var operation = [
			{
				$group: {
					_id: '$type',
					count: {$sum: 1},
				}
			}
		]

		return this
		.aggregate(operation)
		.exec(callback)
	},
	fetchTags: function(callback) {
		return this.distinct('tags')
		.exec(callback)
	},
	updateById: function(article, callback) {
		return this
		.update({_id: article._id}, {$set: article})
		.exec(callback)
	},
	deleteById: function(id, callback) {
		return this
		.remove({_id: id})
		.exec(callback)
	},
}

CommentSchema.statics = {
	count: function(param, callback) {
		var option = {}
		if(param.articleid) option.articleid = param.articleid
		if(param.state) option.state = param.state
		
		return this
		.find(option)
		.count()
		.exec(callback)
	},
	fetch: function(param, callback) {
		var option = {}
		if(param.articleid) option.articleid = param.articleid
		if(param.state) option.state = param.state
		param.page = param.page || 1

		return this
		.find(option)
		.limit(pageNumber)
		.skip((param.page - 1) * pageNumber)
		.sort({ 'datetime': 1 })
		.exec(callback)
	},
	fetchRelation: function(param, callback) {
		var option = {}
		if(param.articleid) option.articleid = param.articleid
		if(param.state) option.state = param.state
		param.page = param.page || 1

		return this
		.find(option)
		.limit(pageNumber)
		.skip((param.page - 1) * pageNumber)
		.sort({ 'datetime': -1 })
		.populate([
			{ path : 'articleid', select : { title: 1 } }
		])
		.exec(callback)
	},
	fetchById: function(id, callback) {
		return this
		.findOne({_id: id})
		.exec(callback)
	},
	updateStateById: function(id, callback) {
	  return this
		.update({_id: id}, {$set: { state: true }})
		.exec(callback)
	},
	deleteById: function(id, callback) {
	  return this
		.remove({_id: id})
		.exec(callback)
	},
	deleteByArticleId: function(articleid, callback) {
		return this
		.remove({ articleid })
		.exec(callback)
	}
}

LinkSchema.statics = {
	count: function(param, callback) {
		var option = {}
		if(param.type) option.type = param.type
		if(param.state) option.state = param.state

		return this
		.find(option)
		.count()
		.exec(callback)
	},
	fetch: function(param, callback) {
		var option = {}
		if(param.type) option.type = param.type
		if(param.state) option.state = param.state
		param.page = param.page || 1

		return this
		.find(option)
		.limit(pageNumber)
		.skip((param.page - 1) * pageNumber)
		.sort({ 'datetime': -1 })
		.exec(callback)
	},
	fetchAuth: function(type, callback) {
		return this
		.find({'type': type, 'state': true})
		.sort({'datetime': -1})
		.exec(callback)
	},
	fetchById: function(id, callback) {
		return this
		.findOne({_id: id})
		.exec(callback)
	},
	updateStateById: function(id, callback) {
		return this
		.update({_id: id}, {$set: { state: true }})
		.exec(callback)
	},
	updateById: function(link, callback) {
		return this
		.update({_id: link._id}, {$set: link})
		.exec(callback)
	},
	deleteById: function(id, callback) {
		return this
		.remove({_id: id})
		.exec(callback)
	},
}

MottoSchema.statics = {
	count: function(param, callback) {
	  var option = {}
	  if(param.keyword) option.motto = { $regex: param.keyword }
  
	  return this
		.find(option)
		.count()
		.exec(callback)
	},
	fetch: function(param, callback) {
	  var option = {}
	  if(param.keyword) option.motto = { $regex: param.keyword }
	  param.page = param.page || 1
  
	  return this
		.find(option)
		.limit(pageNumber)
		.skip((param.page - 1) * pageNumber)
		.sort({ 'datetime': -1 })
		.exec(callback)
	},
	fetchAll: function(callback) {
		return this
		.find({})
		.exec(callback)
	},
	deleteById: function(id, callback) {
	  return this
		.remove({_id: id})
		.exec(callback)
	}
}

MessageSchema.statics = {
	count: function(param, callback) {
	  var option = {}
	  if(param.state) option.state = param.state
	  if(param.keyword) option.content = { $regex: param.keyword }
  
	  return this
		.find(option)
		.count()
		.exec(callback)
	},
	fetch: function(param, callback) {
	  var option = {}
	  if(param.state) option.state = param.state
	  if(param.keyword) option.content = { $regex: param.keyword }
	  param.page = param.page || 1
  
	  return this
		.find(option)
		.limit(pageNumber)
		.skip((param.page - 1) * pageNumber)
		.sort({ 'datetime': -1 })
		.exec(callback)
	},
	fetchById: function(id, cb) {
		return this
		.findOne({_id: id})
		.exec(cb)
	},
	updateStateById: function(id, callback) {
	  return this
		.update({_id: id}, {$set: { state: true }})
		.exec(callback)
	},
	deleteById: function(id, callback) {
	  return this
		.remove({_id: id})
		.exec(callback)
	},
}

SettingSchema.statics = {
	fetchInfo: function(callback) {
	  return this
		.findOne({}, { _id: 0, title: 1, description: 1, meta_keywords: 1, meta_description: 1, authorize_code: 1 })
		.exec(callback)
	},
	updateInfo: function(config, callback) {
	  return this
		.update({}, {$set: config })
		.exec(callback)
	},
	fetchCode: function(callback) {
	  return this
		.findOne({}, { _id: 0, authorize_code: 1 })
		.exec(callback)
	},
}

// ===> 抛出模式
const Article = mongoose.model('Article', ArticleSchema)
const Comment = mongoose.model('Comment', CommentSchema)
const Link    = mongoose.model('Link', LinkSchema)
const Motto   = mongoose.model('Motto', MottoSchema)
const Message = mongoose.model('Message', MessageSchema)
const Setting = mongoose.model('Config', SettingSchema, 'config')

module.exports = { Article, Comment, Link, Motto, Message, Setting }