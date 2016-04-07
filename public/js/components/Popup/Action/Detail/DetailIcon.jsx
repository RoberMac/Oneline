import React from 'react';
import classNames from 'classnames';

import Icon from 'components/Utils/Icon';

import numAbbr from 'utils/numAbbr';


export default ({ name, text, iconCount, active }) => {
    const iconClass = classNames({
        [`detail__column__icon detail__column__icon--${iconCount}`]: iconCount,
        detail__column__cell: !iconCount,
        [`color--${name}`]: active,
        'color--gray-drak': !active,
    });

    let _text;
    switch (text.type) {
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
            <Icon name={name} />
        </div>
    );
};
