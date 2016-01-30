"use strict";
const TwitterStrategy   = require('passport-twitter').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const WeiboStrategy     = require('passport-weibo').Strategy;

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
    const name = profile.displayName;
    const avatar = (
        provider === 'instagram'
            ? profile._json.data.profile_picture
        : profile._json.profile_image_url
    );
    const screen_name = (
        provider === 'instagram'
            ? profile._json.data.username
        : profile._json.screen_name
    );
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