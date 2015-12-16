import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

import { handleImageError, lazySize } from './helper.js';

// Components
import Icon from '../../../Icon';
import Empty from '../../../Empty';
import ViewOriginal from './Utils/ViewOriginal';
import Video from './Utils/Video';

const Image = ({ image_url, ratio }) => (
    <div className="post-media--large" style={lazySize(ratio)}>
        <img src={image_url} onError={handleImageError} />
        <ViewOriginal link={image_url} provider="twitter" />
    </div>
);

// Export
export default class Media extends React.Component {
    render() {
        const { media } = this.props;
        return (
            <div className="post-media">
                {
                    media.map((item, index) => (
                        item.type === 'photo'
                            ? <Image key={index} image_url={item.image_url} ratio={item.ratio} />
                        : <Video
                            key={index}
                            src={item.video_url}
                            poster={item.image_url}
                            ratio={item.ratio}
                        />
                    ))
                }
            </div>
        );
    }
}