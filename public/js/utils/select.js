/**
 * Utils
 *
 */
export const selectExpirationDate = () => Date.now() - 1000 * 60 * 60 * 24 * 3;

/**
 * Provider
 */
export const selectProviderColor = {
    twitter: '#2AA9E0',
    weibo: '#E6162D',
    unsplash: '#999',
};
export const selectFirstProvider = activeProviders => {
    const provider = (
        ~activeProviders.indexOf('twitter')
            ? 'twitter'
        : ~activeProviders.indexOf('weibo')
            ? 'weibo'
        : ~activeProviders.indexOf('unsplash')
            ? 'unsplash'
        : ''
    );

    if (!provider) throw new Error('invalid provider');

    return {
        provider,
        color: selectProviderColor[provider],
    };
};

/**
 * Link
 */
export const selectUserLink = {
    twitter: screen_name => `//twitter.com/${screen_name}`,
    weibo: screen_name => `//weibo.com/n/${screen_name}`,
    unsplash: screen_name => `http://unsplash.com/${screen_name}`,
};
export const selectLocationLink = {
    twitter: ({ id }) => `//twitter.com/search?q=place%3A${id}`,
    weibo: ({ id, place_id }) => (
        place_id
            ? `//weibo.com/p/100101${place_id}`
        : `//maps.google.com/maps?z=12&t=h&q=loc:${id.split('_')[0]}+${id.split('_')[1]}`
    ),
    unsplash: ({ name }) => `//maps.google.com/maps?z=12&t=h&q=${name}`,
};
export const selectTagLink = {
    twitter: ({ tagName }) => `//twitter.com/search?q=%23${tagName}`,
    unsplash: ({ tagName }) => `//unsplash.com/search?utf8=✓&keyword=${tagName}`,
};
export const selectSourceLink = {
    twitter: ({ screen_name, id }) => `//twitter.com/${screen_name}/status/${id}`,
    weibo: ({ uid, mid }) => `//weibo.com/${uid}/${mid}`,
    unsplash: ({ id }) => `//unsplash.com/photos/${id}`,
};
export const selectDownloadLink = {
    unsplash: ({ id }) => `//unsplash.com/photos/${id}/download`,
};
export const selectSearchLink = {
    twitter: ({ searchText }) => `//twitter.com/search?q=${searchText}`,
    weibo: () => '',
    unsplash: ({ searchText }) => `//unsplash.com/search?utf8=✓&keyword=${searchText}`,
};
/**
 * Others
 */
export const selectNextPageId = {
    twitter: ({ minId }) => minId, // for oldest post's id
    weibo: ({ minDate }) => minDate, // for oldest post's created date
    unsplash: ({ action, postsSize }) => {
        const PAGE_COUNT = action === 'user' ? 10 : 20;
        return Math.floor(postsSize / PAGE_COUNT) + 1;
    },
};
export const selectSearchType = {
    local: {
        all: [
            { name: 'text', icon: 'search' },
            { name: 'user', icon: 'user' },
            // { name: 'location', icon: 'location' },
        ],
    },
    remote: {
        twitter: [
            { name: 'text', icon: 'search' },
        ],
        unsplash: [
            { name: 'text', icon: 'search' },
        ],
    },
};
export const selectTextMiddlewares = {
    /**
     * Order
     *     sanitizer: 0
     *     trimSuffixLink: 1
     *     trimMediaLink: 2
     *     Linkify: 3
     *     Emotify: 4
     *     Highlight: 5
     */
    twitter: [
        { order: 0, middleware: 'sanitizer' },
        { order: 3, middleware: 'linkify', opts: { provider: 'twitter' } },
    ],
    weibo: [
        { order: 0, middleware: 'sanitizer' },
        { order: 3, middleware: 'linkify', opts: { provider: 'weibo' } },
        { order: 4, middleware: 'weiboEmotify' },
    ],
    unsplash: [
        { order: 0, middleware: 'sanitizer' },
        { order: 3, middleware: 'linkify', opts: { provider: 'unsplash' } },
    ],
};
