/* eslint global-require: 0 */

const Strategies = {
    Twitter : require('passport-twitter').Strategy,
    Weibo   : require('passport-weibo').Strategy,
    Unsplash: require('passport-unsplash').Strategy,
};

const oauth1 = (token, tokenSecret, profile, done) => {
    const {
        provider,
        id: uid,
        displayName: name,
        username: screen_name,
        _json: { profile_image_url_https: avatar },
    } = profile;
    const id = provider + uid;

    promiseUserFindOne({ id })
    .then(found => {
        const userProfile = {
            provider,
            uid,
            name,
            avatar,
            screen_name,
        };

        if (found) {
            // Update
            Object.assign(found, { token, tokenSecret });
            found.save(err => {
                if (err) return done(err);
                done(null, userProfile);
            });
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
                if (err) return done(err);
                done(null, userProfile);
            });
        }
    }, err => done(err));
};
const oauth2 = (token, refreshToken, profile, done) => {
    const { provider, id: uid } = profile;
    const id = provider + uid;

    let avatar;
    let screen_name;
    let name;
    switch (provider) {
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
        default:
            break;
    }

    promiseUserFindOne({ id })
    .then(found => {
        const userProfile = {
            provider,
            uid,
            name,
            avatar,
            screen_name,
        };

        if (found) {
            // Update
            Object.assign(found, { token, refreshToken });
            found.save(err => {
                if (err) return done(err);
                done(null, userProfile);
            });
        } else {
            // Create
            const user = new User({
                id,
                provider,
                screen_name,
                token,
                refreshToken,
            });
            user.save(err => {
                if (err) return done(err);
                done(null, userProfile);
            });
        }
    }, err => done(err));
};


module.exports = passport => {
    // Twitter
    passport.use(new Strategies.Twitter({
        consumerKey   : process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET,
        callbackURL   : process.env.TWITTER_CB_URL,
    }, oauth1));
    // Weibo
    passport.use(new Strategies.Weibo({
        clientID    : process.env.WEIBO_KEY,
        clientSecret: process.env.WEIBO_SECRET,
        callbackURL : process.env.WEIBO_CB_URL,
    }, oauth2));
    // Unsplash
    passport.use(new Strategies.Unsplash({
        clientID    : process.env.UNSPLASH_KEY,
        clientSecret: process.env.UNSPLASH_SECRET,
        callbackURL : process.env.UNSPLASH_CB_URL,
    }, oauth2));
};
