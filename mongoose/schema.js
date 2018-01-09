/**
 * mongoose 视图
 */

const mongoose 	= require('mongoose')

// ===> 创建模式
var ArticleSchema = new mongoose.Schema({
	title: String,
	content: String,
	outline: String,
	type: String,
	tags: Array,
	pageview: Number,
	datetime: Date,
	top: Number
})

var LinkSchema 	= new mongoose.Schema({
	name: String,
	link: String,
	describe: String,
	type: String,
	state: Number,
	datetime: Date
})

var MottoSchema = new mongoose.Schema({
	motto: String,
	datetime: Date
})

var MessageSchema = new mongoose.Schema({
	nickname: String,
	qq: String,
	link: String,
	content: String,
	state: Number,
	datetime: Date,
  	replyid: String
})

var ConfigSchema = new mongoose.Schema({
	title: String,
	description: String,
	meta_description: String,
	meta_keywords: String,
	username: String,
	password: String
})


// ===> 设置静态方法


// 为模式添加方法 （每次存储数据前都会调用这个方法）
ArticleSchema.pre('save', function(next) {
	this.datetime = Date.now()
	this.pageview = 0
	next()
})

ArticleSchema.statics = {
	count: function(param, cd) {

		let operation = {}

		if(param.keyword) {
			let keyword = param.keyword
			operation.title = {$regex: keyword}
		}

		if(param.type) {
			let type = param.type
			operation.type = type
		}

		if(param.tag) {
			let tag = param.tag
			operation.tags = tag
		}

		return this
			.find(operation)
			.count()
			.exec(cd)
	},
	fetch: function(param, page, cd) {

		let operation = {}

		if(param.keyword) {
			let keyword = param.keyword
			operation.title = {$regex: keyword}
		}

		if(param.type) {
			let type = param.type
			operation.type = type
		}

		if(param.tag) {
			let tag = param.tag
			operation.tags = tag
		}

		return this
			.find(operation)
			.limit(pageNumber)
			.skip((page - 1) * pageNumber)
			.sort({'datetime': -1}) 	// sort 排序 -1 降序 1 升序
			.exec(cd)
	},
	fetchTop: function(cb) {
		return this
			.find({'top': true})
			.sort({'datetime': -1})
			.exec(cb)
	},
	findById: function(id, cd) {
		return this
			.findOne({_id: id})
			.exec(cd)
	},
	fetchTime: function(cd) {
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
			.exec(cd)
	},
	inc: function(id, cd) {
		return this
		.update({_id : id}, {'$inc': {'pageview': 1}}) 	// $inc 【修改器】 1为加1
		.exec(cd)
	},
	groupNav: function(cd) {
		var match;
		// 获取分类
		var operation = [
			{
				$group: {
					_id: '$type',
					count: {$sum: 1}
				}
			}
		]

		return this
			.aggregate(operation)
			.exec(cd)
	},
	groupTags: function(cd) {
		return this.distinct('tags')
			.exec(cd);
	},
	updateById: function(article, cd) {

		var operation = {
			title: article.title,
			outline: article.outline,
			content: article.content,
			type: article.type,
			tags: article.tags,
			top: article.top
		}

		return this
			.update({_id: article._id}, {$set: operation})
			.exec(cd)
	},
	groupNav: function(cd) {
		var match;

		// 获取分类
		var operation = [
			{
				$group: {
					_id: '$type',
					count: {$sum: 1}
				}
			}
		]

		return this
			.aggregate(operation)
			.exec(cd)
	},
	groupTags: function(cd) {
		return this.distinct('tags')
			.exec(cd);
	},
	add: function(article, cd) {
		return new this(article).save(cd)
	},
	deleteById: function(id, cd) {
		return this
			.remove({_id: id})
			.exec(cd)
	}
}

// 为模式添加方法 （每次存储数据前都会调用这个方法）
LinkSchema.pre('save', function(next) {
	this.datetime = Date.now()
	next()
})

LinkSchema.statics = {
	count: function(keyword, type, state, cb) {
		if(type != 'partner' && type != 'tool' && type != 'other') type = {$ne: ''}
		if(state != 0 && state != 1) state = {$ne: -1}

		return this
			.find({'state': state, 'type': type, name: {$regex: keyword}})
			.count()
			.exec(cb)
	},
	fetch: function(keyword, type, state, page, pageNumber, cb) {
		if(type != 'partner' && type != 'tool' && type != 'other') type = {$ne: ''}
		if(state != 0 && state != 1) state = {$ne: -1}

		return this
			.find({'state': state, 'type': type, name: {$regex: keyword}})
			.limit(pageNumber)
			.skip((page - 1) * pageNumber)
			.sort({'datetime': -1})
			.exec(cb)
	},
	fetchAll: function(type, state, cb) {
		return this
			.find({'type': type, 'state': state})
			.sort({'datetime': -1})
			.exec(cb)
	},
	add: function(link, cb) {
		_link = new this({
			name: link.name,
			link: link.link,
			type: link.type,
			state: link.state,
			describe: link.describe
		})

		return _link.save(cb)
	},
	updateById: function(link, cb) {
		return this
			.update({_id: link._id}, {$set: {
				'name': link.name,
				'link': link.link,
				'type': link.type,
				'state': link.state,
				'describe': link.describe
			}})
			.exec(cb)
	},
	deleteById: function(id, cb) {
		return this
			.remove({_id: id})
			.exec(cb)
	},
	updateByIdState: function(id, cb) {
		return this
			.update({_id: id}, {$set: {'state': 1}})
			.exec(cb)
	}
}

// 为模式添加方法 （每次存储数据前都会调用这个方法）
MottoSchema.pre('save', function(next) {
	this.datetime = Date.now()
	next()
})

MottoSchema.statics = {
	count: function(keyword = '', cb) {
		return this
			.find({motto: {$regex: keyword}})
			.count()
			.exec(cb)
	},
	fetch: function(keyword = '', page, pageNumber, cd) {
		return this
			.find({motto: {$regex: keyword}})
			.limit(pageNumber)
			.skip((page - 1) * pageNumber)
			.sort({'datetime': -1})
			.exec(cd)
	},
	fetchAll: function(cb) {
		return this
			.find({})
			.exec(cb)
	},
	add: function(motto, cd) {
		_article = new this({ motto: motto })
		return _article.save(cd)
	},
	deleteById: function(id, cd) {
		return this
			.remove({_id: id})
			.exec(cd)
	}
}

// 为模式添加方法 （每次存储数据前都会调用这个方法）
MessageSchema.pre('save', function(next) {
	this.datetime = Date.now()
	next()
})

MessageSchema.statics = {
	count: function(replyid, state, cd) {
		if(!replyid) replyid = { $ne: null }
		if(state != 0 && state != 1) state = { $ne: '-1' }

		return this
			.find({_id: replyid, state: state})
			.count()
			.exec(cd)
	},
	fetch: function(replyid, state, page, cd) {
		// _id 这里不能用 $ne: '-1', 因为_id是一个ObjectId类型
		if(!replyid) replyid = { $ne: null }
		if(state != 0 && state != 1) state = { $ne: '-1' }

		return this
			.find({_id: replyid, state: state})
			.limit(pageNumber)
			.skip((page - 1) * pageNumber)
			.sort({'datetime': -1})
			.exec(cd)
	},
	fetchById: function(id, cb) {
		return this
		.findOne({_id: id})
		.exec(cb)
	},
	updateById: function(id, cd) {
		return this
			.update({_id: id}, {$set: {'state': 1}})
			.exec(cd)
	},
	deleteById: function(id, cd) {
		return this
			.remove({_id: id})
			.exec(cd)
	}
}

ConfigSchema.statics = {
	fetchInfo: function(cb) {
		return this
			.findOne({}, {_id: 0, title: 1, description: 1})
			.exec(cb)
	},
	fetchMeta: function(cb) {
		return this
			.findOne({}, {_id: 0, meta_description: 1, meta_keywords: 1})
			.exec(cb)
	},
	updateTitle: function(title, cb) {
		return this
			.update({}, {$set: {'title': title}})
			.exec(cb)
	},
	updateDescription: function (description, cb) {
		return this
			.update({}, {$set: {'description': description}})
			.exec(cb);
	},
	updateMetaDescription: function(description, cb) {
		return this
			.update({}, {$set: {'meta_description': description}})
			.exec(cb)
	},
	updateMetaKeywords: function(keywords, cb) {
		return this
			.update({}, {$set: {'meta_keywords': keywords}})
			.exec(cb)
	}
}


// ===> 抛出模式
module.exports = {ArticleSchema, LinkSchema, MottoSchema, MessageSchema, ConfigSchema}