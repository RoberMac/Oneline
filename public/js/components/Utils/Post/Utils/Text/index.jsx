import React from 'react';


// Helper
import Middlewares from './helper';
import CaptureClicks from 'utils/CaptureClicks';
import { selectTextMiddlewares } from 'utils/select';

export default ({ provider, text, middlewares, className }) => {
    let _text = text || '';

    selectTextMiddlewares[provider]
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