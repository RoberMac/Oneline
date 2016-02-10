import React from 'react';
import classNames from 'classnames';

import metaData from 'utils/metaData';

export default ({ type, initLoad, isFetching, isFetchFail, unreadCount, provider, onClick }) => {
    const isNewPosts = type === 'newPosts';
    const wrapperClass = classNames({
        'spin': true,
        'spin--initLoad': initLoad,
        'spin--new': isNewPosts,
        'spin--old': !isNewPosts
    });
    const btnClass = classNames({
        'spin__btn spin__btn--count animate--faster': true,
        [`${provider ? 'spin__btn--' + provider : ''}`]: true,
        'spin__btn--active': metaData.get('isSafari'),
        'spin__btn--loading': isFetching,
        'spin__btn--loading--fail': isFetchFail,
        'spin__btn--new': isNewPosts,
        'spin__btn--old': !isNewPosts
    })
    return (
        <div className={wrapperClass}>
            <button
                className={btnClass}
                data-count={unreadCount <= 0 ? '' : unreadCount}
                type="button"
                onClick={onClick}
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fill-rule="evenodd">
                        <circle cx="42.5" cy="100" r="15"/>
                        <circle cx="100" cy="100" r="15"/>
                        <circle cx="157.5" cy="100.5" r="15"/>
                    </g>
                </svg>
            </button>
        </div>
    );
};
