import React from 'react';
import classNames from 'classnames';

import Icon from '../../../Utils/Icon';

import numAbbr from '../../../../utils/numAbbr';

export default ({ viewBox, name, text, iconCount }) => {
    const iconClass = classNames({
        [`detail__column__icon detail__column__icon--${iconCount}`]: iconCount,
        'detail__column__cell': !iconCount,
        'icon--inactive': true
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
        <div
            className={iconClass}
            data-text={_text}
        >
            <Icon viewBox={viewBox} name={name} />
        </div>
    );
};