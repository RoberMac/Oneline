/** 
 * 向前端發送數據前，過濾多餘信息
 *
 */
var extend = require('extend'),
    mid    = require('weibo-mid');


var filter = {
    twitter: function (data){
        var cache = [];

        data.forEach(function (item){
            var tweetObj = {
                provider: 'twitter',
                created_at: Date.parse(item.created_at),
                id_str: item.id_str,
                user: trimTweetUser(item.user),
                text: item.text,
                retweet_count: item.retweet_count,
                favorite_count: item.favorite_count,
                retweeted: item.retweeted,
                favorited: item.favorited
            }

            // Retweet
            if (item.retweeted_status){
                extend(tweetObj, {
                    type: 'retweet',
                    text: item.retweeted_status.text,
                    retweet: {
                        created_at: Date.parse(item.retweeted_status.created_at),
                        user: trimTweetUser(item.retweeted_status.user)
                    }
                })

                if (item.retweeted_status.extended_entities && item.retweeted_status.extended_entities.media){
                    extend(tweetObj, {
                        media: filterTweetMedia(item.retweeted_status.extended_entities.media),
                        mediaLink: item.retweeted_status.extended_entities.media[0].url
                    })
                }
            } 
            // Quote
            else if (item.quoted_status){
                extend(tweetObj, {
                    type: 'quote',
                    quote: {
                        created_at: Date.parse(item.quoted_status.created_at),
                        id_str: item.quoted_status.id_str,
                        text: item.quoted_status.text,
                        user: trimTweetUser(item.quoted_status.user)
                    }
                })

                if (item.quoted_status.extended_entities && item.quoted_status.extended_entities.media){
                    extend(tweetObj.quote, {
                        media: filterTweetMedia(item.quoted_status.extended_entities.media),
                        mediaLink: item.quoted_status.extended_entities.media[0].url
                    })
                }
            }
            // Reply / Tweet
            else {
                extend(tweetObj, {
                    type: 'tweet'
                })
            }

            // Media
            if (item.extended_entities && item.extended_entities.media){
                extend(tweetObj, {
                    media: filterTweetMedia(item.extended_entities.media),
                    mediaLink: item.extended_entities.media[0].url
                })
            }

            cache.push(tweetObj)
        })

        var returnObj = { data: cache },
            firstData = data[0],
            lastData  = data[data.length - 1];

        if (lastData){
            extend(returnObj, {
                min_id  : lastData.id_str,
                min_date: Date.parse(lastData.created_at),
                max_id  : firstData.id_str,
                max_date: Date.parse(firstData.created_at)
            })
        }

        return returnObj;
    },
    instagram: function (data){
        var cache = [];

        data.forEach(function (item){
            var igPost = {
                provider: 'instagram',
                created_at: Date.parse(new Date(item.created_time * 1000)),
                id_str: item.id,
                type: 'post',
                user: item.user,
                text: item.caption && item.caption.text
                        ? item.caption.text
                        : null,
                images: {
                    low_resolution: item.images.low_resolution.url,
                    standard_resolution: item.images.standard_resolution.url
                },
                favorite_count: item.likes.count,
                favorited: item.user_has_liked,
                reply_count: item.comments.count,
                link: item.link
            }

            if (item.type === 'image'){

            } else if (item.type === 'video'){
                extend(igPost, {
                    videos: {
                        low_resolution: item.videos.low_resolution.url,
                        standard_resolution: item.videos.standard_resolution.url
                    }
                })
            }
            cache.push(igPost)
        })


        var returnObj = { data: cache },
            firstData = data[0],
            lastData  = data[data.length - 1];

        if (lastData){
            extend(returnObj, {
                min_id  : lastData.id,
                min_date: Date.parse(new Date(lastData.created_time * 1000)),
                max_id  : firstData.id,
                max_date: Date.parse(new Date(firstData.created_time * 1000))
            })
        }

        return returnObj;
    },
    weibo: function (data){
        var cache = [];

        data.forEach(function (item){
            var weiboObj = {
                provider: 'weibo',
                created_at: Date.parse(item.created_at),
                id_str: item.idstr,
                mid: mid.encode(item.mid),
                user: trimWeiboUser(item.user),
                text: item.text,
                retweet_count: item.reposts_count,
                comments_count: item.comments_count,
                favorite_count: item.attitudes_count
            }

            // Retweet & Quote
            if (item.retweeted_status){
                var retweetType = item.text === '转发微博' ? 'retweet' : 'quote',
                    retweetItem = item.retweeted_status;

                extend(weiboObj, {
                    type: retweetType,
                    retweet: {
                        created_at: Date.parse(retweetItem.created_at),
                        id_str: retweetItem.idstr,
                        mid: mid.encode(retweetItem.mid),
                        user: trimWeiboUser(retweetItem.user),
                        text: retweetItem.text
                    }
                })

                // media
                if (retweetItem.pic_urls && retweetItem.pic_urls.length > 0){
                    extend(weiboObj, {
                        media: filterWeiboMedia(retweetItem.pic_urls)
                    })
                }
            }
            // Reply / Tweet (Weibo)
            else {
                extend(weiboObj, {
                    type: 'tweet'
                })
            }

            // Media
            if (item.pic_urls.length > 0){
                extend(weiboObj, {
                    media: filterWeiboMedia(item.pic_urls)
                })
            }

            cache.push(weiboObj)
        })

        var returnObj = { data: cache },
            firstData = data[0],
            lastData  = data[data.length - 1];

        if (lastData){
            extend(returnObj, {
                min_id  : lastData.idstr,
                min_date: Date.parse(lastData.created_at),
                max_id  : firstData.idstr,
                max_date: Date.parse(firstData.created_at)
            })
        }

        return returnObj;
    }
}
/**
 * Trim User
 *
 */
function trimTweetUser (user){
    return {
        name: user.name,
        id_str: user.id_str,
        screen_name: user.screen_name,
        avatar: user.profile_image_url_https
    }
}
function trimWeiboUser (user){
    if (!user){
        user = {
            name: '微博小秘书',
            idstr: '1642909335',
            screen_name: '微博小秘书',
            avatar_large: 'http://tp4.sinaimg.cn/1642909335/180/22867541466/1'
        }
    }

    return {
        name: user.name,
        idstr: user.idstr,
        screen_name: user.screen_name,
        avatar: user.profile_image_url
    }
}
/**
 * Filter Media
 *
 */
function filterTweetMedia(items){
    var cache = [];

    items.forEach(function (item){
        var mediaObj = {
            type: item.type,
            image_url: item.media_url_https
        }

        // 'animated_gif' / 'video'
        if (item.type !== 'photo'){
            extend(mediaObj, {
                video_url: item.video_info.variants[0].url
            })
        }

        cache.push(mediaObj)
    })

    return cache
}
function filterWeiboMedia(items){
    var cache = [];

    items.forEach(function (item){
        var type = item.thumbnail_pic.indexOf('\.gif') > 0 ? 'gif' : 'photo',
            image_url = item.thumbnail_pic.replace('thumbnail', 'square');

        var mediaObj = {
            type: type,
            image_url: image_url
        }

        cache.push(mediaObj)
    })

    return cache
}

module.exports = filter