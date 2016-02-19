export const selectUserLink = {
    twitter  : screen_name => `//twitter.com/${screen_name}`,
    instagram: screen_name => `//instagram.com/${screen_name}`,
    weibo    : screen_name => `//weibo.com/n/${screen_name}`
};
export const selectLocationLink = {
    twitter  : ({ id }) => `//twitter.com/search?q=place%3A${id}`,
    instagram: ({ id }) => `//instagram.com/explore/locations/${id}`,
    weibo: ({ id, place_id }) => (
        place_id
            ? `//weibo.com/p/100101${place_id}`
        : `//maps.google.com/maps?z=12&t=h&q=loc:${id.split('_')[0]}+${id.split('_')[1]}`
    )
};
export const selectTagLink = {
    twitter  : ({ tagName }) => `//twitter.com/search?q=%23${tagName}`,
    instagram: ({ tagName }) => `//instagram.com/explore/tags/${tagName}`
};
export const selectSourceLink = {
    twitter: ({ screen_name, id }) => `//twitter.com/${screen_name}/status/${id}`,
    instagram: ({ link }) => link,
    weibo: ({ uid, mid }) => `//weibo.com/${uid}/${mid}`
};
export const selectSearchLink = {
    twitter: ({ searchText }) => `//twitter.com/search?q=${searchText}`,
    instagram: () => '',
    weibo: () => ''
};
export const selectSearchType = {
    local: {
        all: [
            { name: 'text', icon: 'search' },
            { name: 'user', icon: 'user' },
            // { name: 'location', icon: 'location' },
        ]
    },
    remote: {
        twitter: [
            { name: 'text', icon: 'search' },
        ],
        instagram: [
            { name: 'tags', icon: 'tags' },
            { name: 'users', icon: 'user' },
        ]
    }
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
        { order: 3, middleware: 'linkify', opts: { provider: 'twitter' } }
    ],
    instagram: [
        { order: 0, middleware: 'sanitizer' },
        { order: 3, middleware: 'linkify', opts: { provider: 'instagram' } }
    ],
    weibo: [
        { order: 0, middleware: 'sanitizer' },
        { order: 3, middleware: 'linkify', opts: { provider: 'weibo' } },
        { order: 4, middleware: 'weiboEmotify' }
    ]
};