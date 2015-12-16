import React from 'react';
import { Link } from 'react-router';

// Helper
import * as Middlewares from './helper';

export default ({ text, middlewares }) => {
    let _text = text;
    middlewares.forEach( ({ middleware, opts }) => {
        _text = Middlewares[middleware](_text, opts || {})
    })

    return (
        <p className="post-text" dangerouslySetInnerHTML={{ __html: _text }}></p>
    );
}