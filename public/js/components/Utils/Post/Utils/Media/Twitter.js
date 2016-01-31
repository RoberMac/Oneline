import React from 'react';

import { handleImageError, lazySize } from './helper.js';

// Components
import ViewOriginal from './Utils/ViewOriginal';
import Video from './Utils/Video';

const Image = ({ image_url, ratio }) => (
    <div className="post-media--large" style={lazySize(ratio)}>
        <img src={image_url} onError={handleImageError} />
        <ViewOriginal link={image_url} provider="twitter" />
    </div>
);

// Export
export default ({ media }) => (
    <div className="post-media">
        {media.map((item, index) => (
            item.type === 'photo'
                ? <Image key={index} image_url={item.image_url} ratio={item.ratio} />
            : <Video
                key={index}
                src={item.video_url}
                poster={item.image_url}
                ratio={item.ratio}
            />
        ))}
    </div>
);