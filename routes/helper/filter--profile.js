var extend = require('extend');

var filter = {
    twitter: function (data){
        return {
            bio: data.description || '',
            website: data.url || '',
            counts: {
                follows: data.friends_count,
                followed_by: data.followers_count,
                statuses: data.statuses_count
            }
        }
    },
    instagram: function (data){
        return {
            bio: data.bio || '',
            website: data.website || '',
            counts: {
                follows: data.counts.follows,
                followed_by: data.counts.followed_by,
                statuses: data.counts.media
            }
        }
    },
    weibo: function (data){
    }
}

module.exports = filter