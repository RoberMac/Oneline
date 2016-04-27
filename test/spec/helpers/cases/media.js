const { twitter: twitterLink, instagram: instagramLink } = require('./link');

exports.media = {
    media: [{
        image_url: twitterLink,
        ratio    : '1.50167',
        type     : 'photo',
    }],
};

exports.images = {
    images: {
        large: instagramLink,
        ratio: '0.59219',
        small: instagramLink,
    },
};

exports.videos = {
    videos: {
        large: instagramLink,
        small: instagramLink,
    },
};
