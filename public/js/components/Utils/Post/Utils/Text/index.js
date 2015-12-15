import React from 'react';
import { Link } from 'react-router';

// Helper
import { linkify, weiboEmotify, trimSuffixLink, trimMediaLink } from './helper';
class Chain {
    constructor(text) {
        this.text = text
    }
    then(middleware, opts) {
        if (middleware && typeof middleware === 'function'){
            this.text = middleware(this.text, opts)
        }
        return this;
    }
    end() {
        return this.text;
    }
}
const selectMiddlewares = {
    twitter: {
        tweet: () => ([trimSuffixLink, trimMediaLink, linkify]),
        quote: () => ([trimMediaLink, linkify])
    },
    instagram: {
        post: () => ([linkify])
    },
    weibo: {
        tweet: () => ([linkify, weiboEmotify, trimSuffixLink])
    }
}


export default ({ text, provider, type }) => {
    let middlewares = selectMiddlewares[provider][type || 'tweet']();
    const _text = new Chain(text)
                    .then(middlewares.pop(), { provider, type })
                    .then(middlewares.pop(), { provider, type })
                    .then(middlewares.pop(), { provider, type })
                    .then(middlewares.pop(), { provider, type })
                    .end();

    return (
        <p className="post-text" dangerouslySetInnerHTML={{ __html: _text }}></p>
    );
}