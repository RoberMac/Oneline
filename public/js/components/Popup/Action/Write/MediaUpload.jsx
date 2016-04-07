import React from 'react';
import classNames from 'classnames';

// Helpers
import { addClassTemporarily } from 'utils/dom';
import { uploadMedia, addImagePreview } from './helper';

// Components
import Icon from 'components/Utils/Icon';

// Export
export default class MediaUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { inprocess: false };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange() {
        const { provider, media, onChange } = this.props;
        const uploadElem = this.refs.btn;
        const file = uploadElem.files[0];

        // Preview
        const newMediaItem = {};
        addImagePreview({ file })
        .then(({ previewURL, ratio }) => {
            newMediaItem.url = previewURL;
            newMediaItem.ratio = ratio;
            this.setState({ inprocess: true });
        })
        .then(() => {
            // Upload
            uploadMedia({ provider, file })
            .then(id => {
                newMediaItem.id = id;
                onChange({ media: media.concat([newMediaItem]) });
                this.setState({ inprocess: false });
            })
            .catch(() => {
                addClassTemporarily(this.refs.label, 'tips--error', 500);
                this.setState({ inprocess: false });
            });
        });

        // Reset
        uploadElem.value = '';
    }
    render() {
        const { media, action } = this.props;
        const { inprocess } = this.state;
        const btnStyle = (
            inprocess || media.length >= 4 || action === 'retweet'
                ? { pointerEvents: 'none', opacity: '.1' }
            : null
        );
        const btnClass = classNames({
            'write__btn write__btn--media tips--deep--peace': true,
            'tips--inprocess': inprocess,
        });

        return (
            <span>
                <label
                    style={btnStyle}
                    className={btnClass}
                    htmlFor="uploadMedia"
                    role="button"
                    ref="label"
                >
                    <Icon name="camera" />
                </label>
                <input
                    style={{ display: 'none' }}
                    id="uploadMedia"
                    type="file"
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                    onChange={this.handleChange}
                    ref="btn"
                />
            </span>
        );
    }
}
