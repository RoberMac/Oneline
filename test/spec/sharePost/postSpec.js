/* eslint no-undef: 0, key-spacing: 0 */

const _omit = require('lodash.omit');
const postSchema = require('../../../routes/helper/schema/post');

const initBasePost = require('../helpers/cases/post');
const initLocation = require('../helpers/cases/location');
const { twitter: twitterLink } = require('../helpers/cases/link');
const {
    images: mediaImages,
    videos: mediaVideos,
    media: mediaCommons,
} = require('../helpers/cases/media');
const initTwitterPost = () => Object.assign({}, initBasePost, {
    type         : 'tweet',
    provider     : 'twitter',
    retweet_count: 0,
    retweeted: false,
});
const initWeiboPost = () => Object.assign({}, initBasePost, {
    type         : 'tweet',
    provider     : 'weibo',
    mid          : 'DrGC7fqtW',
    retweet_count: 0,
    retweeted    : false,
    reply_count  : 0,
});
const initUnsplashPost = () => Object.assign({}, initBasePost, mediaImages, {
    type          : 'post',
    provider      : 'unsplash',
    download_count: 0,
});

// test requirement keys
describe('base post', () => {
    let post = initUnsplashPost();
    beforeEach(() => {
        post = initUnsplashPost();
    });

    it('allows when post is initPost', () => {
        postSchema.validate(post, err => {
            expect(err).toBeFalsy();
        });
    });
    it('fails when missing requirement keys', () => {
        [
            undefined,
            {},
            _omit(post, 'created_at'),
            _omit(post, 'id_str'),
            _omit(post, 'provider'),
            _omit(post, 'text'),
            _omit(post, 'type'),
            _omit(post, 'user'),
            _omit(post, ['created_at', 'id_str']),
            _omit(post, ['id_str', 'text', 'type']),
        ].forEach(v => {
            postSchema.validate(v, err => {
                expect(err).toBeTruthy();
            });
        });
    });

    // created_at
    describe('> created_at', () => {
        it('allows when `created_at` is a timestamp', () => {
            [0, 1460949286000].forEach(v => {
                postSchema.validate(Object.assign(post, { created_at: v }), err => {
                    expect(err).toBeFalsy();
                });
            });
        });
        it('fails when `created_at` is [!timestamp || !provided || timestamp > Date.now()]', () => {
            [
                {}, true, undefined,
                'Mon Apr 17 2007 17:17:17 GMT+0800 (CST)', '1460949286000',
                '', null,
            ].forEach(v => {
                postSchema.validate(Object.assign(post, { created_at: v }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });

    // type
    describe('> type', () => {
        it('fails when `type` is not a string or not provided', () => {
            [1, {}, true, undefined, '', null].forEach(v => {
                postSchema.validate(Object.assign(post, { type: v }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });

    // location
    describe('> location', () => {
        it('allows when `location` is a provided', () => {
            postSchema.validate(Object.assign(post, { location: initLocation }), err => {
                expect(err).toBeFalsy();
            });
        });
        it('fails when `location.id` is not a string or number', () => {
            [{}, true, '', null].forEach(v => {
                const invalidLocation = Object.assign({}, initLocation, { id: v });
                postSchema.validate(Object.assign(post, { location: invalidLocation }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
        it('fails when `location.name` is not a string or not provided', () => {
            [1, {}, true, undefined, '', null].forEach(v => {
                const invalidLocation = Object.assign({}, initLocation, { name: v });
                postSchema.validate(Object.assign(post, { location: invalidLocation }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });
});

// test optional keys
describe('provider-sensitive post', () => {
    describe('> twitter post', () => {
        let post = initTwitterPost();
        beforeEach(() => {
            post = initTwitterPost();
        });

        it('allows when post is initPost', () => {
            postSchema.validate(post, err => {
                expect(err).toBeFalsy();
            });
        });
        it('fails when contain other providers keys', () => {
            [
                { reply_count: 0 },
                { download_count: 0 },
                { reply_count: 0, download_count: 0 },
                { mid: 'DrGC7fqtW' },
                mediaImages,
                mediaVideos,
            ].forEach(v => {
                postSchema.validate(Object.assign(post, v), err => {
                    expect(err).toBeTruthy();
                });
            });
        });

        // type
        it('fails when `type` contain other providers `type`', () => {
            postSchema.validate(Object.assign(post, { type: 'post' }), err => {
                expect(err).toBeTruthy();
            });
        });

        // actions
        it('fails when missing `actions`', () => {
            [
                _omit(post, 'retweeted'),
                _omit(post, 'retweet_count'),
                _omit(post, ['retweet_count', 'retweeted']),
            ].forEach(v => {
                postSchema.validate(v, err => {
                    expect(err).toBeTruthy();
                });
            });
        });

        // media
        describe('> media', () => {
            beforeEach(() => {
                Object.assign(post, mediaCommons, { mediaLink: twitterLink });
            });

            it('allows when contain "video_url"', () => {
                Object.assign(post.media, { video_url: twitterLink });
                postSchema.validate(post, err => {
                    expect(err).toBeFalsy();
                });
            });
            it('fails when missing `mediaLink` key', () => {
                postSchema.validate(_omit(post, 'mediaLink'), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });

    describe('> weibo post', () => {
        let post = initWeiboPost();
        beforeEach(() => {
            post = initWeiboPost();
        });

        it('allows when post is initPost', () => {
            postSchema.validate(post, err => {
                expect(err).toBeFalsy();
            });
        });
        it('fails when contain other providers keys', () => {
            [
                { download_count: 0 },
                { reply_count: 0, download_count: 0 },
                { mediaLink: twitterLink },
                mediaImages,
                mediaVideos,
                Object.assign({}, mediaImages, mediaVideos),
            ].forEach(v => {
                postSchema.validate(Object.assign(post, v), err => {
                    expect(err).toBeTruthy();
                });
            });
        });

        // type
        it('fails when `type` contain other providers `type`', () => {
            postSchema.validate(Object.assign(post, { type: 'post' }), err => {
                expect(err).toBeTruthy();
            });
        });
    });

    describe('> unsplash post', () => {
        let post = initUnsplashPost();
        beforeEach(() => {
            post = initUnsplashPost();
        });

        it('allows when post is initPost', () => {
            postSchema.validate(post, err => {
                expect(err).toBeFalsy();
            });
        });
        it('fails when contain other providers keys', () => {
            [
                { retweet_count: 0 },
                { retweeted: false },
                { reply_count: 0 },
                { retweet_count: 0, retweeted: false },
                { mid: 'DrGC7fqtW' },
                { mediaLink: twitterLink },
                mediaCommons,
                Object.assign({}, { mediaLink: twitterLink }, mediaCommons),
            ].forEach(v => {
                postSchema.validate(Object.assign(post, v), err => {
                    expect(err).toBeTruthy();
                });
            });
        });

        // type
        it('fails when `type` contain other providers `type`', () => {
            ['tweet', 'retweet', 'quote'].forEach(v => {
                postSchema.validate(Object.assign(post, { type: v }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });
});

// test nest post
describe('nest post', () => {
    describe('> twitter || weibo', () => {
        it('allows when `type` is "retweet" or "quote"', () => {
            ['retweet', 'quote'].forEach(t => {
                [initTwitterPost(), initWeiboPost()].forEach(p => {
                    const post = Object.assign({}, p, { type: t }, { [t]: p });
                    postSchema.validate(post, err => {
                        expect(err).toBeFalsy();
                    });
                });
            });
        });
    });

    describe('> unsplash', () => {
        it('fails when `type` is "retweet" or "quote"', () => {
            ['retweet', 'quote'].forEach(t => {
                [initUnsplashPost()].forEach(p => {
                    const post = Object.assign({}, p, { type: t }, { [t]: p });
                    postSchema.validate(post, err => {
                        expect(err).toBeTruthy();
                    });
                });
            });
        });
    });
});
