
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

/**
 * 异步加载留言
 * 
 * @param {any} page 页码
 * @param {any} beforeSend 请求前
 * @param {any} success 成功回调
 */
function AjaxGetMessage(page, beforeSend, success) {
    requests({
        url: 'api/message/page/' + page,
        beforeSend: beforeSend,
        success: success,
        error: function(err) {
            alert('加载留言信息失败！')
        }
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
function AjaxAddMessage(message, beforeSend, success, complete) {
    requests({
        url: 'api/message/add',
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