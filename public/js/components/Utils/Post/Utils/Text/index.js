import React from 'react';


// Helper
import * as Middlewares from './helper';
import CaptureClicks from '../../../../../utils/CaptureClicks';

export default ({ text, middlewares, className }) => {
    let _text = text;
    middlewares.forEach( ({ middleware, opts }) => {
        _text = Middlewares[middleware](_text, opts || {})
    })

    return (
        <p
            className={`post-text ${className || ''}`}
            dangerouslySetInnerHTML={{ __html: _text }}
            onClick={CaptureClicks}
        />
    );
}