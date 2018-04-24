;(function($) {
	getday()
	
	// 初始化播放器
	initMusic()

	$('.major-box').showImg({ bgColor: "rgba(0, 0, 0, .5)" })

	// mobile 点击菜单
	$('.mobile-nav a.icon-menu').on('click', function(e) {
		e.stopPropagation()
		$('.mobile-navs').show()
		$('.mobile-mask').show()
	})

	$('.mobile-navs > a, .mobile-mask').on('click', function() {
		$('.mobile-navs').hide()
		$('.mobile-mask').hide()
	})
	
	// 点击返回顶部事件
	$('.totop-btn').on('click', function() { totop() })

	// 搜索
	$('form#search').on('submit', function(e) {
		e.stopPropagation()
		e.preventDefault()

		let v = $.trim(this.keyword.value)
		v && routeUnobtrusive(`/search/${v}`)
	})

	// 页面全局的a标签跳转
	$('body').on('click', 'a[type=ajax_a]', function(e) {
		e = e || event
		if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
		e.preventDefault ? e.preventDefault() : e.returnValue = false

		routeUnobtrusive($(this).attr("href"));
	})

	// 显示返回顶部按钮
	$(window).on('scroll', function(e) {
		let height = $(this).scrollTop()
		let totopBtn = $('.totop-btn')
		height > 300 ? totopBtn.addClass('active') : totopBtn.removeClass('active')
	})

	// 给游览器绑定前进/后退事件
	$(window).on('popstate', function(e) {
		window.history.state && loadPage(window.history.state)
	})

	if(window.console && window.console.log) {
		console.log("\n %c i am here %c https://www.miiiku.xyz \n\n", "color: #fff; background: #ff3365; padding: 5px 0px", "background: #efefef; padding: 5px 0px")
	}
})(jQuery, undefined)

// 设置游览器保存的地址
function routeUnobtrusive(href) {
	window.history.pushState(href, "", href);
 
	let url = window.location.href
	let height = $(window).scrollTop()
	
	height > 200 ? totop(loadPage(url)) : loadPage(url)
}

// 返回页面顶部
function totop(callback) {
   $('html, body').stop().animate({
	   scrollTop: 0
   }, 500, function() {
	  $('.totop-btn').removeClass('active')
	  callback && callback()
   })
}

// 获取网站存活天数
function getday() {
  var startTime = new Date("2016-12-05 00:00:00")
  var nowTime = new Date()
  var oldTime = nowTime.getTime() - startTime.getTime()
  var day = Math.floor(oldTime/1000/60/60/24)
  $('.site-time').html(`站点已存活${day}天`)
}

// 初始化音乐播放器
function initMusic() {
	var userAgentInfo = navigator.userAgent
	var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
	for(let item of Agents) { if(userAgentInfo.indexOf(item) >= 0) return false }

	var playlist = [
        {
            "title": "アストロノーツ",
            "author": "れをる",
            "url": "/music/れをる - アストロノーツ.mp3",
            "pic": "https://p3.music.126.net/vPgS9BjwMKNaTATevXBXfg==/6657542907991862.jpg?param=120y120"
        },
        {
            "title": "No title",
            "author": "れをる",
            "url": "/music/れをる - No title.mp3",
            "pic": "https://p1.music.126.net/cZPx3peGTuWEI_GaZB5CDg==/8892850045794893.jpg?param=120y120"
        },
        {
            "title": "カントリー・ロード",
            "author": "ツヅリ・ヅクリ",
            "url": "/music/ツヅリ・ヅクリ - カントリー・ロード.mp3",
            "pic": "https://p1.music.126.net/fiyQkkGxsS2rx1ymbBuphg==/7952767605425790.jpg?param=120y120"
        },
        {
            "title": "ぼくら",
            "author": "ヘクとパスカル",
            "url": "/music/ヘクとパスカル - ぼくら.mp3",
            "pic": "https://p1.music.126.net/KrBV3KoeVY1ZXoOv7Wbg1Q==/7804333534626753.jpg?param=120y120"
        },
        {
            "title": "いつも何度でも",
            "author": "伊藤サチコ",
            "url": "/music/伊藤サチコ - いつも何度でも.mp3",
            "pic": "https://p1.music.126.net/GYWkXtrnAawOWO2nfLg3PA==/109951163028865726.jpg?param=120y120"
        },
        {
            "title": "銀色飛行船",
            "author": "Supercell",
            "url": "/music/Supercell - 銀色飛行船.mp3",
            "pic": "https://p1.music.126.net/0gJSRbh0TE30OtnDebHmeA==/5839506255164737.jpg?param=120y120"
		},
        {
            "title": "夢追人",
            "author": "KOKIA",
            "url": "/music/KOKIA - 夢追人.mp3",
            "pic": "https://p1.music.126.net/3t5JIxQKohR5gk_cZqjLGw==/2275989069517444.jpg?param=120y120"
        },
        {
            "title": "TRAIN",
            "author": "ONE☆DRAFT",
            "url": "/music/ONE☆DRAFT - TRAIN.mp3",
            "pic": "https://p1.music.126.net/Tet19RIOsn_ouka8v9GMbw==/916992697608061.jpg?param=120y120"
        },
        {
            "title": "小さな恋のうた",
            "author": "ダイアナ・ガーネット",
            "url": "/music/ダイアナ・ガーネット - 小さな恋のうた.mp3",
            "pic": "https://p1.music.126.net/Iw6fszahMzjO7ShPmk0THA==/5648191232016535.jpg?param=120y120"
        },
        {
            "title": "Everyday Love",
            "author": "少女时代",
            "url": "/music/少女时代 - Everyday Love.mp3",
            "pic": "https://p1.music.126.net/-DZrXSJuP5nC2W3YSJb5Lw==/5788928720322741.jpg?param=120y120"
        },
        {
            "title": "明日晴れるかな",
            "author": "桑田佳祐",
            "url": "/music/桑田佳祐 - 明日晴れるかな.mp3",
            "pic": "https://p1.music.126.net/hKAMn29IQksdDQs5PI3m5w==/2490393836938087.jpg?param=120y120"
        }
    ]

    aplayer = new APlayer({
        element: document.getElementById('aplayer'),
        narrow: false,
        autoplay: false,
        showlrc: false,
        mutex: true,
        theme: '#ad7a86',
        mode: 'random',
        music: playlist
	})
}
 
// 获取页面
function loadPage(url) {
	$('body').append('<div class="loader"></div>')

	$(".major-box").load(url + ' .major-content', function(response, status, xhr) {
		$('body .loader').remove()
		if(!response || status == 'error') return loadError()
		var startIndex = response.indexOf('<title>')
		var endIndex = response.indexOf('</title>')
		var title = response.substring(startIndex + 7, endIndex)
	   $('title').html(title)
	})
}

// 加载错误
function loadError() {
	var errorTITLE = 'Error - ' + $('title').text().split(' - ')[1]
	var errorHTML = `
		<article class="other-box">
			<h3>Error</h3>
			<p>加载错误 请稍后再试！</p>
			<p>确保网络能够正常访问！</p>
			<p>(。﹏。*)</p>
		</article>
	`
	$('.major-content').html(errorHTML)
	$('title').html(errorTITLE)
}
 
// 回复留言
function replyMessage(el) {
	var $a = $(el)
	var section = $a.parents(".comment")
	var messageForm = $("#message-form")
 
	if(section.find('#message-form').length < 1) {
		let replyid = $a.data("id")
		let nickname = $a.data("nickname")
		messageForm.find("textarea").attr("placeholder", "@" + nickname)
		messageForm.find("input[type=hidden][name=replyid]").val(replyid)
		section.append(messageForm)
		$a.text('取消')
	}else {
		messageForm.find("textarea").attr("placeholder", "说点什么吧～")
		messageForm.find("input[type=hidden]").val("")
		$(".respond-box").append(messageForm)
		$a.text('回复')
	}
}

// 加载留言
function loadMessage(el) {
	var $load = $(el)

	if($load.hasClass('load-message-animation')) return console.log('加载中。。。')
	if($load.hasClass('end')) return console.log('加载完成。。。')

	var param = {
		type: $load.attr('data-type'),
		page: $load.data('page') || 2,
	}
	if(param.type === 'comment') param.id = $load.attr('data-id')
	
	var loadTHML = $load.text()
	var loadDOM = `	
		<div class="rect1"></div>
		<div class="rect2"></div>
		<div class="rect3"></div>
		<div class="rect4"></div>
		<div class="rect5"></div>
	`
 
	AjaxGetMessage(param, function() {
		$load.empty().append(loadDOM).addClass("load-message-animation")
	}, function(data) {
		if(!data) {
			$load.empty().removeClass("load-message-animation").addClass('end').text("以全部加载完成！")
		}else {
			$load.empty().removeClass("load-message-animation").text(loadTHML)
			$load.data("page", ++param.page)
			$(".message-list").append(data)
		}
	}, function(err) {
		$.alert('加载信息失败，请稍后再试~')
		$load.empty().removeClass("load-message-animation").text(loadTHML)
	})
}
 
// 提交留言
function messageSubmit(el) {
 
	if($(el).attr("disabled")) return
 
	var form = $("#message-form")[0]
	var type = $(el).attr('data-type')
 
	if($.trim(form.nickname.value) == "") {
	   form.nickname.focus()
	   return $.alert("请留下你的名字叭！", 'waring')
	}
 
	if($.trim(form.email.value)   == "") {
	   form.email.focus()
	   return $.alert("留下邮箱号并不会怀*！", 'waring')
	}
 
	if($.trim(form.content.value)  == "") {
	   form.content.focus()
	   return $.alert("难道就没有一句想吐槽的吗？", 'waring')
	}
 
	AjaxAddMessage(type, $("#message-form").serialize(), function() {
		$(el).attr('disabled',"true")
	}, function(data) {
		if(!data) return $.alert("获取数据格式错误！", 'error')
		$.alert("DUANG~ 留言成功！", 'success')

		if($(".message-list").length < 1) {
			$(".NoData") && $(".NoData").remove()
			$(".message-box").append(`<div class='message-list'>${data}</div>`)
		}else {
			if(type === "comment") $(".message-list").append(data)
			if(type === "message") $(".message-list").prepend(data)
		}

		form.content.value = ''
	}, function() {
		$(el).removeAttr('disabled')
	})
}
 