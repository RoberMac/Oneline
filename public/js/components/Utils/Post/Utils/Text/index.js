import React from 'react';


// Helper
import * as Middlewares from './helper';
import CaptureClicks from '../../../../../utils/CaptureClicks';
const selectMiddlewares = {
    twitter: [],
    instagram: [
        { middleware: 'linkify', opts: { provider: 'instagram' } }
    ],
    weibo: [
        { middleware: 'linkify', opts: { provider: 'weibo' } },
        { middleware: 'weiboEmotify' }
    ]
};

export default ({ provider, text, middlewares, className }) => {
    const _middlewares = middlewares || selectMiddlewares[provider];
    let _text = text;

    _middlewares.forEach( ({ middleware, opts }) => {
        _text = Middlewares[middleware](_text, opts || {})
    });

    return <p
        className={`post-text ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: _text }}
        onClick={CaptureClicks}
    />;
}