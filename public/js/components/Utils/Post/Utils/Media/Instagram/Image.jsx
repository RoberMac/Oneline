/* eslint jsx-a11y/img-uses-alt: 0 */

import React from 'react';

// Helpers
import { handleImageError, lazySize } from '../helper.js';

// Components
import ViewOriginal from '../Utils/ViewOriginal';
import UsersInPhoto from './UsersInPhoto';

// Export
export default class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = { imgWidth: 0, imgHeight: 0 };
        this.updateSize = this.updateSize.bind(this);
    }
    componentDidMount() {
        this.updateSize();
    }
    updateSize() {
        const { offsetWidth, offsetHeight } = this.refs.image;

        this.setState({ imgWidth: offsetWidth, imgHeight: offsetHeight });
    }
    render() {
        const { images, users_in_photo } = this.props;
        return (
            <div className="post-media--large" style={lazySize(images.ratio)}>
                <img
                    src={images.large}
                    onError={handleImageError}
                    ref="image"
                />
                <ViewOriginal link={images.large} provider="instagram" />
                {users_in_photo && <UsersInPhoto users_in_photo={users_in_photo} {...this.state} />}
            </div>
        );
    }
}
