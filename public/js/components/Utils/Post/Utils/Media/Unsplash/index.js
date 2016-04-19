/* eslint jsx-a11y/img-uses-alt: 0 */

import React from 'react';

import { handleImageError, lazySize } from '../helper.js';

// Components
import ViewOriginal from '../Utils/ViewOriginal';

// Export
export default ({ images }) => (
    <div className="post-media">
        <div className="post-media--large" style={lazySize(images.ratio)}>
            <img src={images.small} onError={handleImageError} />
            <ViewOriginal link={images.large} provider="unsplash" />
        </div>
    </div>
);
