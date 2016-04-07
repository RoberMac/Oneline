import React from 'react';

// Components
import Video from '../Utils/Video';
import Image from './Image';

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
