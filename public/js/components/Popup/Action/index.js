import React from 'react';

import Write from './Write';
import Read from './Read';

export const Action = props => {
    const { action } = props.params;

    let SelectAction;
    switch (action){
        case 'user':
        case 'locations':
        case 'tags':
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
            history={props.history}
            location={props.location}
            {...props.params} // provider, action, id
        />
    );
}