/* eslint jsx-a11y/img-uses-alt: 0 */

import React from 'react';

import { handleImageError, lazySize } from '../helper.js';

// Components
import ViewOriginal from '../Utils/ViewOriginal';

// Export
export default ({ image_url, ratio }) => (
    <div className="post-media--large" style={lazySize(ratio)}>
        <img src={image_url} onError={handleImageError} />
        <ViewOriginal link={`${image_url}:large`} provider="twitter" />
    </div>
);
