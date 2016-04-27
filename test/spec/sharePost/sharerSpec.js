/* eslint no-undef: 0 */

const _omit = require('lodash.omit');

const sharerSchema = require('../../../routes/helper/schema/sharer');
const initUser = require('../helpers/cases/user');
const initLink = require('../helpers/cases/link');

describe('user', () => {
    let user = Object.assign({}, initUser, { provider: 'twitter' });
    beforeEach(() => {
        user = Object.assign({}, initUser, { provider: 'twitter' });
    });

    it('should be valid', () => {
        sharerSchema.validate(user, err => {
            expect(err).toBeFalsy();
        });
    });
    it('fails when missing keys', () => {
        [
            undefined,
            {},
            _omit(user, 'uid'),
            _omit(user, 'provider'),
            _omit(user, 'avatar'),
            _omit(user, 'name'),
            _omit(user, 'screen_name'),
            _omit(user, ['uid', 'name']),
            _omit(user, ['provider', 'avatar', 'screen_name']),
        ].forEach(v => {
            sharerSchema.validate(v, err => {
                expect(err).toBeTruthy();
            });
        });
    });

    // uid
    describe('> uid', () => {
        it('allows when `uid` is a string', () => {
            ['n0mber', '2006.3.21', '2006321'].forEach(v => {
                sharerSchema.validate(Object.assign(user, { uid: v }), err => {
                    expect(err).toBeFalsy();
                });
            });
        });
        it('fails when `uid` is not a string or not provided', () => {
            [1, {}, true, undefined, '', null].forEach(v => {
                sharerSchema.validate(Object.assign(user, { uid: v }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });

    // provider
    describe('> provider', () => {
        it('allows when `provider` is valid provider', () => {
            ['twitter', 'instagram', 'weibo', 'unsplash'].forEach(v => {
                sharerSchema.validate(Object.assign(user, { provider: v }), err => {
                    expect(err).toBeFalsy();
                });
            });
        });
        it('fails when `provider` is not a string or not provided or invalid', () => {
            [1, {}, true, undefined, '', null, 'facebook'].forEach(v => {
                sharerSchema.validate(Object.assign(user, { provider: v }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });

    // avatar
    describe('> avatar', () => {
        it('allows when `avatar` is a valid URL', () => {
            [
                initLink.https,
                initLink.twitter,
                initLink.instagram,
                initLink.weibo,
                initLink.unsplash,
            ].forEach(v => {
                sharerSchema.validate(Object.assign(user, { avatar: v }), err => {
                    expect(err).toBeFalsy();
                });
            });
        });
        it('fails when `avatar` is not a string or not provided or invalid', () => {
            [
                1, {}, true, undefined, '', null,
                'git@github.com:RoberMac/Oneline.git',
                'notifications@github.com ',
                'Oneline',
                '//pbs.twimg.com/profile_images/668328458519384064/FSAIjKRl.jpg',
                'pbs.twimg.com/profile_images/668328458519384064/FSAIjKRl.jpg',
            ].forEach(v => {
                sharerSchema.validate(Object.assign(user, { avatar: v }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });

    // name
    describe('> name', () => {
        it('allows when `name` is a (empty) string', () => {
            ['n0mber', '2006.3.21', '2006321', ''].forEach(v => {
                sharerSchema.validate(Object.assign(user, { name: v }), err => {
                    expect(err).toBeFalsy();
                });
            });
        });
        it('fails when `name` is not a string or not provided', () => {
            [1, {}, true, undefined, null].forEach(v => {
                sharerSchema.validate(Object.assign(user, { name: v }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });

    // screen_name
    describe('> screen_name', () => {
        it('allows when `screen_name` is a (empty) string', () => {
            ['n0mber', '2006.3.21', '2006321'].forEach(v => {
                sharerSchema.validate(Object.assign(user, { screen_name: v }), err => {
                    expect(err).toBeFalsy();
                });
            });
        });
        it('fails when `screen_name` is not a string or not provided', () => {
            [1, {}, true, undefined, '', null].forEach(v => {
                sharerSchema.validate(Object.assign(user, { screen_name: v }), err => {
                    expect(err).toBeTruthy();
                });
            });
        });
    });
});
