/** 
 * 向前端發送數據前，過濾多餘信息
 *
 */
var extend = require('extend');


var filter = {
    tweet: function (data){
        var cache = [];

        data.forEach(function (item){
            var tweetObj = {
                provider: 'twitter',
                created_at: Date.parse(item.created_at),
                id_str: item.id_str,
                user: trimTweetUser(item.user),
                text: item.text
            }

            // Retweet
            if (item.retweeted_status){
                extend(tweetObj, {
                    type: 'retweet',
                    retweet: {
                        created_at: Date.parse(item.retweeted_status.created_at),
                        text: item.retweeted_status.text,
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
            else if (item.quoted_status_id){
                extend(tweetObj, {
                    type: 'quote',
                    quote: {
                        created_at: Date.parse(item.quoted_status.created_at),
                        id_str: item.quoted_status.id_str,
                        text: item.quoted_status.text,
                        user: trimTweetUser(item.quoted_status.user)
                    }
                })
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
            lastData  = data[data.length - 1];

        if (lastData){
            extend(returnObj, {
                min_id  : lastData.id_str,
                min_date: Date.parse(lastData.created_at)
            })
        }

        return returnObj;
    },
    igPost: function (data){
        var cache = [];

        data.forEach(function (item){
            var igPost = {
                provider: 'instagram',
                created_at: Date.parse(new Date(item.created_time * 1000)),
                id_str: item.id,
                type: item.type,
                user: item.user,
                text: item.caption && item.caption.text
                        ? item.caption.text
                        : null,
                images: {
                    low_resolution: item.images.low_resolution.url,
                    standard_resolution: item.images.standard_resolution.url
                }
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
            lastData  = data[data.length - 1];

        if (lastData){
            extend(returnObj, {
                min_id  : lastData.id,
                min_date: Date.parse(new Date(lastData.created_time * 1000))
            })
        }

        return returnObj;
    }
}

function trimTweetUser (user){
    return {
        name: user.name,
        screen_name: user.screen_name,
        profile_image_url_https: user.profile_image_url_https
    }
}

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

module.exports = filter