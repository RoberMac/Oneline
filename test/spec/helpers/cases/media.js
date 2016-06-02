const { twitter: twitterLink, unsplash: unsplashLink } = require('./link');

exports.media = {
    media: [{
        image_url: twitterLink,
        ratio    : '1.50167',
        type     : 'photo',
    }],
};

exports.images = {
    images: {
        large: unsplashLink,
        ratio: '0.59219',
        small: unsplashLink,
    },
};
