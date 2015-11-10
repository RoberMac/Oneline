angular.module('Oneline.mediaDirectives', [])
.directive('olVideo', function (){
    return {
        restrict: 'E',
        scope: {
            olPoster: '@',
            olSrc: '@',
            olId: '@'
        },
        templateUrl: 'media/video.html',
        link: function (scope, elem, attrs){
            var _C_PLAY_BTN = 'timeline__media__playButton--playing',
                video = elem.children()[0];

            video.setAttribute('src', scope.olSrc)

            elem
            .on('click', function (){
                var post = angular.element(document.querySelector('[data-id="' + scope.olId + '"]')),
                    playIcon = angular.element(elem.children()[1]);

                video.paused ? video.play() : video.pause()
                playIcon.toggleClass(_C_PLAY_BTN)

                post
                .on('mouseleave', function (){
                    video.pause()
                    playIcon.removeClass(_C_PLAY_BTN)
                    video.removeAttribute('loop')

                    post.off()
                })
            })
            .on('$destroy', function (){
                elem.off()
            })

            angular.element(video)
            .on('ended', function (){
                playIcon.removeClass(_C_PLAY_BTN)
            })
        }
    }
})
.directive('olImageThumb', function (){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            elem
            .on('click', function (){
                var wrapper_thumb  = elem.parent(),
                    wrapper_large  = wrapper_thumb.next(),
                    img_thumb      = wrapper_thumb.children(),
                    img_large      = wrapper_large.find('img'),
                    jump_elem      = wrapper_large.find('a');

                // 設置小圖樣式
                img_thumb
                .removeClass('timeline__media--active')
                .addClass('timeline__media--inactive')

                elem.addClass('timeline__media--active timeline__media--loading')
                wrapper_thumb.addClass('timeline__media--small')
                // 設置大圖樣式
                wrapper_large.removeClass('timeline__media--hide')
                img_large.attr('src', attrs.src.replace(/square|small/, 'bmiddle'))
                // 設置外鏈
                jump_elem.attr('href', attrs.src.replace(/square|small/, 'large'))
                // 大圖加載完畢
                img_large.on('load', function (){
                    img_thumb.length === 1 ? elem.parent().remove() : null
                    elem.removeClass('timeline__media--loading')
                })
                // 附加數據
                if (!img_large.data('urlList')){
                    var urlList = Array.prototype.map.call(img_thumb, function (item){
                        return angular.element(item).attr('src').replace(/square|small/, 'bmiddle')
                    })  
                    img_large.data('urlList', urlList)
                }
            })
            .on('$destroy', function (){
                elem.off()
            })
        }
    }
})
.directive('selectImage', function (){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){

            if (attrs.imageCount > 1){
                // 光標提示
                elem
                .on('mousemove', function (e){
                    if (e.offsetX - elem[0].offsetWidth / 2 > 0){
                        elem.removeClass('cursor--pre')
                        elem.addClass('cursor--next')
                    } else {
                        elem.removeClass('cursor--next')
                        elem.addClass('cursor--pre')
                    }
                })
                // 上／下一幅
                .on('click', function (){
                    var img_large = elem.find('img');
                    var urlList = img_large.data('urlList') || [],
                        currentIndex = urlList.indexOf(img_large.attr('src')),
                        index = elem.hasClass('cursor--next') ? currentIndex + 1 : currentIndex - 1;

                    if (index < 0 || index > urlList.length - 1) return;

                    var img_thumb = angular.element(
                                        angular.element(
                                            elem.parent().children()[0]
                                        ).children()
                                    ),
                        target = angular.element(img_thumb[index]);

                    // 設置小圖樣式
                    img_thumb.removeClass('timeline__media--active timeline__media--loading')
                    target.addClass('timeline__media--active timeline__media--loading')

                    img_large
                    // 大圖加載完畢
                    .on('load', function (){
                        // 設置小圖樣式
                        target.removeClass('timeline__media--loading')
                    })
                    // 設置圖片地址
                    .attr('src', urlList[index])
                    // 設置外鏈
                    .next().attr('href', urlList[index].replace('bmiddle', 'large'))
                })
                .on('$destroy', function (){
                    elem.off()
                })
            }
        }
    }
})
.directive('handleImageError', function (){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            elem
            .on('error', function (){
                if (elem.attr('src') === '') return;

                elem.attr('src', 'data:image/svg+xml;utf8,<svg viewBox="0 0 529 530" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M51.245 150.775c-3.454-1.729-5.458-.098-4.476 3.638l.706 2.688c8.01 30.498-2.986 73.86-24.566 96.854l-.662.706c-2.643 2.816-1.649 5.288 2.193 5.52l136.636 8.237c9.376.565 23.953-2.031 32.554-5.798l21.279-9.319-13.768-18.801c-5.55-7.579-16.851-17.127-25.254-21.333l-124.642-62.392z" fill="#000"/><path d="M9.298 290.938c13.001 129.203 122.073 230.062 254.702 230.062 141.385 0 256-114.615 256-256s-114.615-256-256-256c-84.794 0-159.96 41.226-206.547 104.728" stroke="#000" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M361.259 190.733c-4.06-1.129-8.339-1.733-12.759-1.733-26.234 0-47.5 21.266-47.5 47.5 0 4.115.523 8.109 1.507 11.917" stroke="#000" stroke-width="17" stroke-linecap="round"/><path d="M213.468 406.97c13.141-16.776 37.347-28.026 65.032-28.026 30.37 0 56.552 13.538 68.536 33.056" stroke="#000" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/></g></svg>')
            })
        }
    }
})
.directive('fuckLongWeibo', function (){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            elem
            .on('load', function (){
                var _imageW = elem[0].width,
                    _viewportH = window.innerWidth;

                if (_viewportH * 0.33 / _imageW > 2){
                    var originPic = elem.next()

                    originPic.attr('href', originPic.attr('href').replace('large', 'bmiddle'))
                }
            })
        }
    }
})
.directive('olLazyImage', function (){
    return {
        restrict: 'A',
        scope: {
            ratio: '@olLazyImage'
        },
        link: function (scope, elem, attrs){
            var _ratio = scope.ratio;

            elem.css('padding-bottom', _ratio * 100 + '%')
        }
    }
})
.directive('usersInPhoto', function (){
    return {
        restrict: 'A',
        scope: {
            usersInPhoto: '='
        },
        link: function (scope, elem, attrs){
            var usersInPhoto = scope.usersInPhoto;

            elem
            .on('click', function (){
                var userTag = elem.parent().find('span'),
                    mediaElem = elem.parent().parent()[0];

                if (elem.hasClass('tips--active--peace')){
                    elem.removeClass('tips--active--peace')
                    userTag.parent().removeClass('timeline__media__userTag--show')
                } else {
                    elem.addClass('tips--active--peace')

                    usersInPhoto.forEach(function (user, index){
                        var _elem = angular.element(userTag[index]),
                            _w = mediaElem.offsetWidth,
                            _h = mediaElem.offsetHeight,
                            _x = user.position.x,
                            _y = user.position.y,
                            _deg = calcDegree(_x, _y, _w, _h);

                        _elem.children().css({
                            transform: 'rotate(' + ( - _deg ) + 'deg)'
                        })

                        _elem.parent()
                        .css({
                            top: _y * 100 + '%',
                            left: 'calc(' + _x * 100 + '% - 16px)',
                            transform: 'rotate(0deg)'
                        })
                        .addClass('timeline__media__userTag--show')
                        .addClassTemporarily('timeline__media__userTag--popup', 700)
                        .delay(777)
                        .then(function (__elem){
                            __elem.css('transform', 'rotate(' + _deg + 'deg)')
                        })
                    })
                }
            })
            .on('$destroy', function (){
                elem.off()
            })

            function calcDegree(_x, _y, _w, _h){
                var __w, __h, _deg;

                if (_x > 0.5){
                    __w = (1 - _x) * _w
                    // 右下
                    if (_y > 0.5){
                        __h = (1 - _y) * _h
                        _deg = ratio2deg(__h / __w) + 90
                    }
                    // 右上
                    else {
                        __h = _y * _h
                        _deg = ratio2deg(__w / __h)
                    }
                }
                else {
                    __w = _x * _w
                    // 左下
                    if (_y > 0.5){
                        __h = (1 - _y) * _h
                        _deg = ratio2deg(__w / __h) + 180
                    }
                    // 左上
                    else {
                        __h = _y * _h
                        _deg = - ratio2deg(__h / __w)
                    }
                }

                return _deg;
            }
            function ratio2deg(_ratio){
                return Math.atan(_ratio) * 180 / Math.PI;
            }
        }
    }
})

