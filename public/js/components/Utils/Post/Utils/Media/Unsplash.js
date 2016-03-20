import React from 'react';
import classNames from 'classnames';

import { handleImageError, lazySize } from './helper.js';

// Components
import Icon from 'components/Utils/Icon';
import Transition from 'components/Utils/Transition';
import ViewOriginal from './Utils/ViewOriginal';

// Export
export default ({ images }) => (
    <div className="post-media">
        <div className="post-media--large" style={lazySize(images.ratio)}>
            <img src={images.large} onError={handleImageError} />
            <ViewOriginal link={images.large} provider="unsplash" />
        </div>
    </div>
);