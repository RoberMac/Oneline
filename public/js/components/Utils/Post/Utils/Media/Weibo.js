import React from 'react';
import classNames from 'classnames';

// TODO: Helper


// Components
import Icon from '../../../Icon';

export default ({ media }) => {
    const mediaThumbClass = classNames('timeline__media', 'overflow--x', 'timeline__media--thumb');
    const mediaSrcClass = classNames(
        'timeline__media__icon',
        'timeline__media__icon--origin',
        'icon--weibo',
        'tips--deep animate--faster'
    );
    return (
        <div className={mediaThumbClass}>
            {media.map((item, index)=> {
                const gifClass = classNames({
                    'animate--faster': true,
                    'timeline__media--gif': item.type === 'gif'
                });
                return <img key={index} className={gifClass} src={item.image_url} />;
            })}
            <div className="timeline__media timeline__media--hide">
                <img src="" alt="weibo_large_photo" />
                <a href="" target="_blank" className={mediaSrcClass}>
                    <Icon viewBox="0 0 100 100" name="eyeball" />
                </a>
            </div>
        </div>
    );
}