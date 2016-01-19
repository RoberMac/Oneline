import React from 'react';
import classNames from 'classnames';

import Icon from 'components/Utils/Icon';

import numAbbr from 'utils/numAbbr';
const selectViewBox = (type) => {
    switch (type){
        case 'retweet':
            return '0 0 34 26';
            break;
        default:
            return '0 0 26 26';
            break;
    }
};


export default ({ name, text, iconCount, active }) => {
    const iconClass = classNames({
        [`detail__column__icon detail__column__icon--${iconCount}`]: iconCount,
        'detail__column__cell': !iconCount,
        [`icon--${name}`]: active,
        'icon--inactive': !active

    });

    let _text;
    switch (text.type){
        case 'count':
            _text = numAbbr(text.content);
            break;
        case 'date':
            _text = new Date(text.content).toLocaleDateString();
            break;
        default:
            _text = text.content;
            break;
    }

    return (
        <div className={iconClass} data-text={_text}>
            <Icon viewBox={selectViewBox(name)} name={name} />
        </div>
    );
};