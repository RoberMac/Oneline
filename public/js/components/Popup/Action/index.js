import React from 'react';

import User from './User';
import Location from './Location';
import Tag from './Tag';
import Write from './Write';
import Read from './Read';

export const Action = ({ params }) => {
    const action = params.action;
    let SelectAction;
    switch (action){
        case 'user':
            SelectAction = User;
            break;
        case 'location':
            SelectAction = Location;
            break;
        case 'tag':
            SelectAction = Tag;
            break;
        case 'write':
            SelectAction = Write;
            break;
        case 'read':
            SelectAction = Read;
            break;
    }

    return <SelectAction />;
}