import React from 'react';

import Write from './Write';
import Read from './Read';

export const Action = props => {
    const { provider, action, id } = props.params;

    let SelectAction;
    switch (action){
        case 'user':
        case 'location':
        case 'tag':
            SelectAction = Read;
            break;
        case 'tweet':
        case 'retweet':
        case 'quote':
        case 'reply':
            SelectAction = Write;
            break;
    }

    return (
        <SelectAction
            provider={provider}
            action={action}
            id={id}
            history={props.history}
            post={props.location.state}
        />
    );
}