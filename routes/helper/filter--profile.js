var filter = {
    twitter: {
        retweet: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.user.name,
                    avatar: item.user.profile_image_url_https,
                    screen_name: item.user.screen_name,
                    uid: item.user.id_str
                })
            })

            return cache;
        },
        user: function (data){
            return {
                bio: data.description || '',
                website: data.url || '',
                counts: {
                    follows: data.friends_count,
                    followed_by: data.followers_count,
                    statuses: data.statuses_count
                },
                following: data.following,
                protected: data.protected
            }
        },
        follow: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.name,
                    avatar: item.profile_image_url_https,
                    screen_name: item.screen_name
                })
            })

            return cache;
        }
    },
    instagram: {
        like: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.full_name,
                    avatar: item.profile_picture,
                    screen_name: item.username,
                    uid: item.id
                })
            })

            return cache;
        },
        reply: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.from.full_name,
                    avatar: item.from.profile_picture,
                    screen_name: item.from.username,
                    uid: item.from.id,
                    text: item.text,
                    created_at: item.created_time * 1000
                })
            })

            return cache;
        },
        user: function (data){
            return {
                bio: data.bio || '',
                website: data.website || '',
                counts: {
                    follows: data.counts.follows,
                    followed_by: data.counts.followed_by,
                    statuses: data.counts.media
                }
            }
        }
    },
    weibo: {
        reply: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.user.name,
                    avatar: item.user.profile_image_url,
                    screen_name: item.user.screen_name,
                    id: item.user.idstr,
                    text: item.text,
                    created_at: Date.parse(item.created_at)
                })
            })

            return cache;
        }
    }
}

module.exports = filter