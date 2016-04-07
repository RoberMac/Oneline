import React from 'react';

// Components
import Video from '../Utils/Video';
import Image from './Image';

// Export
export default ({ images, videos, users_in_photo }) => (
    <div className="post-media">
    {videos
        ? <Video
            src={videos.large}
            poster={images.small}
            ratio={images.ratio}
        />
        : <Image images={images} users_in_photo={users_in_photo} />
    }
    </div>
);
