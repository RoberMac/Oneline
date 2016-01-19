import React from 'react';


// Helper
import * as Middlewares from './helper';
import CaptureClicks from 'utils/CaptureClicks';
/**
 * Order
 *     sanitizer: 0
 *     trimSuffixLink: 1
 *     trimMediaLink: 2
 *     Linkify: 3
 *     Emotify: 4
 */
const selectMiddlewares = {
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

export default ({ provider, text, middlewares, className }) => {
    let _text = text || '';

    selectMiddlewares[provider]
    .concat(Array.isArray(middlewares) ? middlewares : [])
    .sort((a, b) => a.order < b.order ? -1 : 1)
    .forEach( ({ middleware, opts }) => {
        _text = Middlewares[middleware](_text, opts || {})
    });

    return (_text
        ? <p
            className={`post-text ${className || ''}`}
            dangerouslySetInnerHTML={{ __html: _text }}
            onClick={CaptureClicks}
        />
        : <span />
    );
}