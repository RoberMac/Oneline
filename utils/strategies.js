"use strict";
const STRATEGY = {
    twitter: require('passport-twitter').Strategy,
    instagram: require('passport-instagram').Strategy,
    weibo: require('passport-weibo').Strategy,
    unsplash: require('passport-unsplash').Strategy
};

const oauth1 = (token, tokenSecret, profile, done) => {
    const provider = profile.provider;
    const uid = profile.id;
    const name = profile.displayName;
    const screen_name = profile.username;
    const avatar = profile._json.profile_image_url_https
    const id = provider + uid;

    q_userFindOne({ id })
    .then(found => {
        const userProfile = {
            provider,
            uid,
            name,
            avatar,
            screen_name
        };

        if (found){
            // Update
            Object.assign(found, { token, tokenSecret })
            found.save(err => {
                if (err) return done(err)
                done(null, userProfile)
            })
        } else {
            // Create
            const user = new User({
                id,
                provider,
                screen_name,
                token,
                tokenSecret,
            });
            user.save(err => {
                if (err) return done(err)
                done(null, userProfile)
            })
        }
    }, err => done(err))
}
const oauth2 = (token, refreshToken, profile, done) => {
    const provider = profile.provider;
    const uid = profile.id;
    const id = provider + uid;

    let avatar, screen_name, name;
    switch (provider) {
        case 'instagram':
            avatar = profile._json.data.profile_picture;
            screen_name = profile.username;
            name = profile.displayName;
            break;
        case 'weibo':
            avatar = profile._json.profile_image_url;
            screen_name = profile._json.screen_name;
            name = profile.displayName;
            break;
        case 'unsplash':
            avatar = profile.avatar.medium;
            screen_name = profile.username;
            name = `${profile.name.first_name} ${profile.name.last_name}`;
            break;
    }

    q_userFindOne({ id })
    .then(found => {
        const userProfile = {
            provider,
            uid,
            name,
            avatar,
            screen_name
        };

        if (found){
            // Update
            Object.assign(found, { token, refreshToken })
            found.save(err => {
                if (err) return done(err)
                done(null, userProfile)
            })
        } else {
            // Create
            const user = new User({
                id,
                provider,
                screen_name,
                token,
                refreshToken
            });
            user.save(err => {
                if (err) return done(err)
                done(null, userProfile)
            })
        }
    }, err => done(err))
}


module.exports = passport => {
    // Twitter
    passport.use(new STRATEGY.twitter({
        'consumerKey'   : process.env.TWITTER_KEY,
        'consumerSecret': process.env.TWITTER_SECRET,
        'callbackURL'   : process.env.TWITTER_CB_URL
    }, oauth1))
    // Instagram
    passport.use(new STRATEGY.instagram({
        'clientID'    : process.env.INSTAGRAM_KEY,
        'clientSecret': process.env.INSTAGRAM_SECRET,
        'callbackURL' : process.env.INSTAGRAM_CB_URL
    }, oauth2))
    // Weibo
    passport.use(new STRATEGY.weibo({
        'clientID'    : process.env.WEIBO_KEY,
        'clientSecret': process.env.WEIBO_SECRET,
        'callbackURL' : process.env.WEIBO_CB_URL
    }, oauth2))
    // Unsplash
    passport.use(new STRATEGY.unsplash({
        'clientID'    : process.env.UNSPLASH_KEY,
        'clientSecret': process.env.UNSPLASH_SECRET,
        'callbackURL' : process.env.UNSPLASH_CB_URL
    }, oauth2))
}