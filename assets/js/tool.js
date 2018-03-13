;(function($) {
    $.extend({
        alert: function(str, state, timeout, callback) {
            var icon = ''
            switch (state) {
                case 'success':
                    icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTE0MTcyMzcxOTAyIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4NjAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMiAwQzIyOS4yNDggMCAwIDIyOS4yNDggMCA1MTIgMCA3OTQuNzUyIDIyOS4yNDggMTAyNCA1MTIgMTAyNCA3OTQuNzUyIDEwMjQgMTAyNCA3OTQuNzUyIDEwMjQgNTEyIDEwMjQgMjI5LjI0OCA3OTQuNzUyIDAgNTEyIDBaTTQzMi42NCA3NDguMjQ1MzMzIDE5Ny4wNzczMzMgNTEyLjY0IDI4Ny41MzA2NjcgNDIyLjE0NCA0MzIuNTk3MzMzIDU2Ny4yNTMzMzMgNzQwLjM5NDY2NyAyNTkuNDk4NjY3IDgzMC44NDggMzQ5Ljk5NDY2NyA0MzIuNjQgNzQ4LjI0NTMzM1oiIHAtaWQ9IjE4NjEiIGZpbGw9IiMxYWZhMjkiPjwvcGF0aD48L3N2Zz4='
                break;
                case 'error':
                    icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTE0MTcyNDA5NDc1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2ODIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTY1Ni41NjY4NTcgNjQxLjEzMzcxNHEwLTE0Ljg0OC0xMC44NjE3MTQtMjUuNzA5NzE0bC0xMDMuNDI0LTEwMy40MjQgMTAzLjQyNC0xMDMuNDI0cTEwLjg2MTcxNC0xMC44NjE3MTQgMTAuODYxNzE0LTI1LjcwOTcxNCAwLTE1LjQzMzE0My0xMC44NjE3MTQtMjYuMjk0ODU3bC01MS40MTk0MjktNTEuNDE5NDI5cS0xMC44NjE3MTQtMTAuODYxNzE0LTI2LjI5NDg1Ny0xMC44NjE3MTQtMTQuODQ4IDAtMjUuNzA5NzE0IDEwLjg2MTcxNGwtMTAzLjQyNCAxMDMuNDI0LTEwMy40MjQtMTAzLjQyNHEtMTAuODYxNzE0LTEwLjg2MTcxNC0yNS43MDk3MTQtMTAuODYxNzE0LTE1LjQzMzE0MyAwLTI2LjI5NDg1NyAxMC44NjE3MTRsLTUxLjQxOTQyOSA1MS40MTk0MjlxLTEwLjg2MTcxNCAxMC44NjE3MTQtMTAuODYxNzE0IDI2LjI5NDg1NyAwIDE0Ljg0OCAxMC44NjE3MTQgMjUuNzA5NzE0bDEwMy40MjQgMTAzLjQyNC0xMDMuNDI0IDEwMy40MjRxLTEwLjg2MTcxNCAxMC44NjE3MTQtMTAuODYxNzE0IDI1LjcwOTcxNCAwIDE1LjQzMzE0MyAxMC44NjE3MTQgMjYuMjk0ODU3bDUxLjQxOTQyOSA1MS40MTk0MjlxMTAuODYxNzE0IDEwLjg2MTcxNCAyNi4yOTQ4NTcgMTAuODYxNzE0IDE0Ljg0OCAwIDI1LjcwOTcxNC0xMC44NjE3MTRsMTAzLjQyNC0xMDMuNDI0IDEwMy40MjQgMTAzLjQyNHExMC44NjE3MTQgMTAuODYxNzE0IDI1LjcwOTcxNCAxMC44NjE3MTQgMTUuNDMzMTQzIDAgMjYuMjk0ODU3LTEwLjg2MTcxNGw1MS40MTk0MjktNTEuNDE5NDI5cTEwLjg2MTcxNC0xMC44NjE3MTQgMTAuODYxNzE0LTI2LjI5NDg1N3pNODc3LjcxNDI4NiA1MTJxMCAxMTkuNDQyMjg2LTU4Ljg0MzQyOSAyMjAuMjY5NzE0dC0xNTkuNzA3NDI5IDE1OS43MDc0MjktMjIwLjI2OTcxNCA1OC44NDM0MjktMjIwLjI2OTcxNC01OC44NDM0MjktMTU5LjcwNzQyOS0xNTkuNzA3NDI5LTU4Ljg0MzQyOS0yMjAuMjY5NzE0IDU4Ljg0MzQyOS0yMjAuMjY5NzE0IDE1OS43MDc0MjktMTU5LjcwNzQyOSAyMjAuMjY5NzE0LTU4Ljg0MzQyOSAyMjAuMjY5NzE0IDU4Ljg0MzQyOSAxNTkuNzA3NDI5IDE1OS43MDc0MjkgNTguODQzNDI5IDIyMC4yNjk3MTR6IiBwLWlkPSIyNjgzIiBmaWxsPSIjZDgxZTA2Ij48L3BhdGg+PC9zdmc+'
                break;
                case 'waring':
                    icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTE0MTczMjY0ODE2IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4ODAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTU1OS42NTI4MTEgNzY2LjYzMDMwNWMtMTIuOTI1MzgxIDEyLjk2MTE5Ni0yOC41NTk0NTMgMTkuNDA3MDAyLTQ2LjcyOTI3OCAxOS40MDcwMDItMTguMTcxODcxIDAtMzQuMTgyNTItNi40NDU4MDYtNDcuMTc2NDYyLTE5LjQwNzAwMi0xMy40NDAxMDQtMTMuMDI2Njg4LTE5Ljg4NTkwOS0yOC41OTIxOTgtMTkuODg1OTA5LTQ3LjE3NTQzOSAwLTE4LjE3MTg3MSA2LjQ0NTgwNi0zNC4yNTAwNTggMTkuODg1OTA5LTQ3LjE3NjQ2MiAxMi45OTM5NDItMTMuNDczODczIDI5LjAwNDU5MS0xOS45NTM0NDggNDcuMTc2NDYyLTE5Ljk1MzQ0OCAxOC4xNjk4MjUgMCAzMy43NzAxMjggNi40Nzg1NTIgNDYuNzI5Mjc4IDE5Ljk1MzQ0OCAxMy40NzM4NzMgMTIuOTI2NDA0IDE5LjkxOTY3OCAyOS4wMDQ1OTEgMTkuOTE5Njc4IDQ3LjE3NjQ2MkM1NzkuNTcyNDkgNzM4LjAzODEwNiA1NzMuMTI2Njg0IDc1My42MDM2MTcgNTU5LjY1MjgxMSA3NjYuNjMwMzA1ek00NjQuOTI0MzMzIDMyMS42NDg2NzRjMTIuNTE0MDEyLTEzLjQwNjMzNSAyOC41OTQyNDUtMjAuMzMxMDQ4IDQ3Ljk5OTIwMS0yMC4zMzEwNDggMTkuNDczNTE3IDAgMzUuNTE4OTU4IDYuNDc5NTc1IDQ4LjA2Nzc2MiAyMC4zMzEwNDggMTIuMTM1Mzg4IDEzLjQwNTMxMSAxOC41ODExOTQgMzAuMzA4MjgzIDE4LjU4MTE5NCA1MC42NzMxIDAgMTcuMjc5NTQ4LTI1Ljk4Nzg4NCAxNDUuODQ3NzM5LTM1LjAwNTI1OCAyMzkuMzQyMTFsLTYyLjc3NDcxOSAwYy03LjM3MTg5OC05My41MjkxNjMtMzUuOTMwMzI3LTIyMi4wOTczNTQtMzUuOTMwMzI3LTIzOS4zNDIxMUM0NDUuODYyMTg1IDM1Mi40MDEwNzIgNDUyLjM0Mjc4NCAzMzUuNDk5MTI0IDQ2NC45MjQzMzMgMzIxLjY0ODY3NHpNOTQwLjE0NjcwOSA3NTguODEzMjY5IDU5MC40MDcyNTYgMTQ4LjU0MzEyOGMtNDIuODIyMjk0LTc0LjQzMjIyMy0xMTIuNTU3NTQyLTc0LjQzMjIyMy0xNTUuMzQ0MDIxIDBMODUuMzIyNzU5IDc1OC44MTMyNjljLTQyLjc4NzUwMiA3NC4zOTg0NTQtNy44MTcwMzYgMTM1LjQyNjM4OSA3Ny44OTUwOTEgMTM1LjQyNjM4OWw2OTkuNDQ2MTYgMEM5NDcuOTMwOTk5IDg5NC4yMzk2NTggOTgzLjAwMjc3MiA4MzMuMjEyNzQ2IDk0MC4xNDY3MDkgNzU4LjgxMzI2OXoiIHAtaWQ9IjE4ODEiIGZpbGw9IiNmNGVhMmEiPjwvcGF0aD48L3N2Zz4='
                break;
                default: 
                    icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTE0MTcyNDI2MzEwIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM0NzUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMiAxMjhDMjk5LjUyIDEyOCAxMjggMjk5LjUyIDEyOCA1MTIgMTI4IDcyNC40OCAyOTkuNTIgODk2IDUxMiA4OTYgNzI0LjQ4IDg5NiA4OTYgNzI0LjQ4IDg5NiA1MTIgODk2IDI5OS41MiA3MjQuNDggMTI4IDUxMiAxMjhMNTEyIDEyOCA1MTIgMTI4Wk01NzIuNTg2NjY2IDcyNS4zMzMzMzRDNTcyLjU4NjY2NiA3NDQuMTA2NjY2IDU1Ni4zNzMzMzQgNzYwLjMyIDUzNy42IDc2MC4zMkw0ODQuNjkzMzM0IDc2MC4zMkM0NjUuOTIgNzYwLjMyIDQ0OS43MDY2NjYgNzQ0LjEwNjY2NiA0NDkuNzA2NjY2IDcyNS4zMzMzMzRMNDQ5LjcwNjY2NiA1MDEuNzZDNDQ5LjcwNjY2NiA0ODIuMTMzMzM0IDQ2NS45MiA0NjYuNzczMzM0IDQ4NC42OTMzMzQgNDY2Ljc3MzMzNEw1MzcuNiA0NjYuNzczMzM0QzU1Ni4zNzMzMzQgNDY2Ljc3MzMzNCA1NzIuNTg2NjY2IDQ4Mi45ODY2NjYgNTcyLjU4NjY2NiA1MDEuNzZMNTcyLjU4NjY2NiA3MjUuMzMzMzM0IDU3Mi41ODY2NjYgNzI1LjMzMzMzNFpNNTExLjE0NjY2NiA0MDguNzQ2NjY2QzQ3MS44OTMzMzQgNDA4Ljc0NjY2NiA0MzkuNDY2NjY2IDM3Ni4zMiA0MzkuNDY2NjY2IDMzNi4yMTMzMzQgNDM5LjQ2NjY2NiAyOTYuMTA2NjY3IDQ3MS44OTMzMzQgMjYzLjY4IDUxMS4xNDY2NjYgMjYzLjY4IDU1MS4yNTMzMzQgMjYzLjY4IDU4My42OCAyOTYuMTA2NjY3IDU4My42OCAzMzYuMjEzMzM0IDU4My42OCAzNzYuMzIgNTUxLjI1MzMzNCA0MDguNzQ2NjY2IDUxMS4xNDY2NjYgNDA4Ljc0NjY2Nkw1MTEuMTQ2NjY2IDQwOC43NDY2NjZaIiBwLWlkPSIzNDc2IiBmaWxsPSIjMTI5NmRiIj48L3BhdGg+PC9zdmc+'
                break;
            }
            
            var css = `
                display: none;
                position: fixed;
                top: 80px;
                left: 50%;
                min-height: 46px;
                max-width: 50vw;
                line-height: 26px;
                transform: translateX(-50%);
                padding: 10px 10px 10px 46px;
                background-image: url(${icon});
                background-color: #fff;
                background-size: 26px;
                background-repeat: no-repeat;
                background-position: 10px 10px;
                font-size: 14px;
                border-radius: 6px;
                border: 1px solid #f3f3f3;
                box-shadow: 1px 1px 3px rgba(0, 0, 0, .5);
            `

            var $alert = $(`<div class="alert-container" style="${css}">${str}</div>`)

            $('body').append($alert.fadeIn(300))

            setTimeout(() => {

                $alert.fadeOut(300, function() {
                    $(this).remove()
                })

                callback && callback()
            }, timeout || 3000)
        }
    })
})(jQuery)

;(function($) {

    $.fn.showImg = function(options) {
        this.on('click', 'img', function() {
            let src = $(this).attr('src')
            src && $.createImg(src, options)
        })
    }

    $.fn.showImg.defaults = {
        bgColor: 'rgba(255, 255, 255, .5)'
    }

    $.extend({
        createImg: function(src, options) {
            $('.img-show-box') && $('.img-show-box').remove()
            
            var opt = $.extend({}, $.fn.showImg.defaults, options)

            var l = function() {
                let loadDOM = `
                    <div class="load-message-animation">
                        <div class="rect1"></div>
                        <div class="rect2"></div>
                        <div class="rect3"></div>
                        <div class="rect4"></div>
                        <div class="rect5"></div>
                    </div>
                `
                imgShowContent.append(loadDOM)

            }

            var c = function(imageObj) {
                imgShowContent.empty().append(imageObj)
            }

            var img = new Image()
            img.src = src

            var imgShowBox = $('<div class="img-show-box"></div>')
            var imgShowContent = $('<div class="img-show-content"></div>')

            imgShowBox.css('background-color', opt.bgColor)

            imgShowBox.on('click', function() {
                imgShowBox.fadeOut(500, function() {
                    imgShowBox.remove()
                })
            })

            $('body').append(imgShowBox.append(imgShowContent))

            imgShowBox.fadeIn(500)

            if(img.complete) return c(img)
            else l()

            img.onload = function() {
                c(this)
            }
        }
    })

})(jQuery)

const log = window.console.log.bind(window.console)