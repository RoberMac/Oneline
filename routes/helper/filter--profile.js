var filter = {
    twitter: {
        retweet: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.user.name,
                    avatar: item.user.profile_image_url_https,
                    screen_name: item.user.screen_name,
                    id_str: item.user.id_str
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
                    id: item.id
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
                    id: item.from.id,
                    text: item.text
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
    weibo: function (data){
    }
}

module.exports = filter