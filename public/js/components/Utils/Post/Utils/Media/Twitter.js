import React from 'react';

import { handleImageError, lazySize, lazySrc } from './helper.js';

// Components
import LazyLoad from 'components/Utils/LazyLoad';
import ViewOriginal from './Utils/ViewOriginal';
import Video from './Utils/Video';
const Image = ({ image_url, ratio, visible }) => (
    <div className="post-media--large" style={lazySize(ratio)}>
        <img src={visible ? image_url : lazySrc} onError={handleImageError} />
        <ViewOriginal link={image_url} provider="twitter" />
    </div>
);
const Media = ({ media, visible }) => (
    <div className="post-media">
        {media.map((item, index) => (
            item.type === 'photo'
                ? <Image key={index} image_url={item.image_url} ratio={item.ratio} visible={visible} />
            : <Video
                key={index}
                src={item.video_url}
                poster={item.image_url}
                ratio={item.ratio}
                visible={visible}
            />
        ))}
    </div>
);

// Export
export default props => (
    <LazyLoad once>
        <Media {...props} />
    </LazyLoad>
);