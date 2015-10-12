var TwitterStrategy = require('passport-twitter').Strategy,
    InstagramStrategy = require('passport-instagram').Strategy,
    WeiboStrategy   = require('passport-weibo').Strategy;


module.exports = function (passport){


// Twitter
passport.use(new TwitterStrategy({
    'consumerKey'   : process.env.TWITTER_KEY,
    'consumerSecret': process.env.TWITTER_SECRET,
    'callbackURL'   : process.env.TWITTER_CB_URL
}, oauth1))

// Instagram
passport.use(new InstagramStrategy({
    'clientID'    : process.env.INSTAGRAM_KEY,
    'clientSecret': process.env.INSTAGRAM_SECRET,
    'callbackURL' : process.env.INSTAGRAM_CB_URL
}, oauth2))

// Weibo
passport.use(new WeiboStrategy({
    'clientID'    : process.env.WEIBO_KEY,
    'clientSecret': process.env.WEIBO_SECRET,
    'callbackURL' : process.env.WEIBO_CB_URL
}, oauth2))


}



function oauth1 (token, tokenSecret, profile, done){

    var id = profile.provider + profile.id;

    q_userFindOne({ id: id })
    .then(function (found){
        if (found){
            found.token = token
            found.tokenSecret = tokenSecret
            found.save(function (err){
                if (err) return done(err)
                done(null, found)
            })
        } else {
            var avatar, screen_name;

            if (profile.provider === 'twitter'){
                avatar = profile._json.profile_image_url_https
                screen_name = profile.username
            }

            var user = new User({
                'id'         : id,
                'userId'     : profile.id + '',
                'displayName': profile.displayName,
                'screen_name': screen_name,
                'provider'   : profile.provider,
                'avatar'     : avatar,
                'token'      : token,
                'tokenSecret': tokenSecret
            })
            user.save(function (err){
                if (err) return done(err)
                done(null, user)
            })
        }
    }, function (err){
        return done(err) 
    })
}

function oauth2 (accessToken, refreshToken, profile, done){

    var id = profile.provider + profile.id;

    q_userFindOne({ id: id })
    .then(function (found){
        if (found){
            found.token = accessToken
            found.refreshToken = refreshToken
            found.save(function (err){
                if (err) return done(err)
                done(null, found)
            })
        } else {
            var avatar, screen_name;

            if (profile.provider === 'instagram'){
                avatar = profile._json.data.profile_picture
                screen_name = profile._json.data.username
            } else if (profile.provider === 'weibo'){
                avatar = profile._json.profile_image_url
                screen_name = profile._json.screen_name
            }

            var user = new User({
                'id'         : id,
                'userId'     : profile.id + '',
                'displayName': profile.displayName,
                'screen_name': screen_name,
                'provider'   : profile.provider,
                'avatar'     : avatar,
                'token'      : accessToken,
                'refreshToken': refreshToken
            })
            user.save(function (err){
                if (err) return done(err)
                done(null, user)
            })
        }
    }, function (err){
        return done(err)
    })
}
