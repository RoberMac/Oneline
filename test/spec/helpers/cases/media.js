const link = require('./link');

exports.media = {
    media: [{
        image_url: link.twitter,
        ratio    : '1.50167',
        type     : 'photo',
    }],
};

exports.images = {
    images: {
        large: link.instagram,
        ratio: '0.59219',
        small: link.instagram,
    },
};

exports.videos = {
    videos: {
        large: link.instagram,
        small: link.instagram,
    },
};
