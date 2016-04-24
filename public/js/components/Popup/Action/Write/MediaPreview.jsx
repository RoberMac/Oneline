/* eslint jsx-a11y/img-redundant-alt: 0 */

import React from 'react';

export default class MediaPreview extends React.Component {
    constructor(props) {
        super(props);
        this.removeMedia = this.removeMedia.bind(this);
    }
    removeMedia(index) {
        const { media, onChange } = this.props;

        onChange({
            media: [...media.slice(0, index), ...media.slice(index + 1)],
        });
    }
    render() {
        const { media } = this.props;
        return (
            <div className="write__mediaPreview">
            {
                media.map(({ url }, index) => (
                    <span
                        className="write__mediaPreview__item animate--faster"
                        key={url}
                        onClick={() => this.removeMedia(index)}
                    >
                        <img src={url} alt={`uploaded image ${index}`} />
                    </span>
                ))
            }
            </div>
        );
    }
}
