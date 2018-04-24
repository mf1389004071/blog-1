
// 封装通用AJAX方法
function requests(options) {
    let defaults = {
        type: 'GET',
        data: null,
        async: true,
        timeout: 5000,
        contentType: 'application/json',
        beforeSend: function(XHR) {},
        success: function(data) {},
        error: function(XHR, textStatus, errorThrown) {},
        complete: function(XHR, TS) {}
    }

    let requestObj = $.extend({}, defaults, options)

    if(!requestObj.url) return console.log('ajax请求地址无效！')

    $.ajax(requestObj)
}


function login(code, success) {
    requests({
        url: 'api/login',
        type: 'POST',
        data: JSON.stringify({ code }),
        success: success,
        error: function(err) {
            alert('登陆失败，服务器错误！')
        }
    })
}

/**
 * 异步加载留言
 * 
 * @param {any} type 加载数据类型
 * @param {any} page 页码
 * @param {any} beforeSend 请求前
 * @param {any} success 成功回调
 */
function AjaxGetMessage(param, beforeSend, success, error) {
    var url = ""
    if(param.type === "message") url = `/api/message/page/${param.page}`
    if(param.type === "comment") url = `/api/comment/${param.id}/${param.page}`
    if(!url) return $.alert("加载类型错误！", "error")
    requests({
        url: url,
        beforeSend: beforeSend,
        success: success,
        error: error
    })
}

/**
 * 异步添加留言
 * 
 * @param {any} message 
 * @param {any} beforeSend 
 * @param {any} success 
 * @param {any} complete 
 */
function AjaxAddMessage(type, message, beforeSend, success, complete) {
    var url = ""
    if(type === "comment") url = '/api/comment/add'
    if(type === "message") url = '/api/message/add'
    if(!type) return $.alert("请求类型错误！", "error")
    requests({
        url: url,
        type: 'POST',
        data: JSON.stringify({ message }),
        beforeSend: beforeSend,
        success: success,
        error: function(err) {
            alert('添加留言信息失败！')
        },
        complete: complete
    })
}