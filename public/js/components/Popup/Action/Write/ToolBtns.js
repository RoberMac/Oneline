import React from 'react';
import classNames from 'classnames';

// Helper
import { addClassTemporarily } from '../../../../utils/dom';
import { getCountInfo, uploadMedia, addImagePreview } from './helper';

// Components
import Icon from '../../../Utils/Icon';

export class GeoPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false, selected: false }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        const { inprocess, selected } = this.state;
        const { onChange } = this.props;

        if (inprocess) return;

        if (selected) {
            this.setState({ inprocess: false, selected: false })
            onChange({ type: 'geo', payload: {} })
        } else {
            this.setState({ inprocess: true })

            window.navigator.geolocation.getCurrentPosition(pos => {
                this.setState({ inprocess: false, selected: true })

                const { latitude, longitude } = pos.coords;
                onChange({
                    type: 'geo',
                    payload: {
                        lat: latitude,
                        long: longitude
                    }
                })
            }, err => {
                this.setState({ inprocess: false, selected: false })
                addClassTemporarily(this.refs.btn, 'tips--error', 500)
            }, { maximumAge: 60000, timeout: 7000 })
        }
    }
    render() {
        const { inprocess, selected } = this.state;
        const btnClass = classNames({
            'write__btn write__btn--left tips--deep--peace': true,
            'tips--active--peace': selected,
            'tips--inprocess': inprocess
        });

        return (
            <button className={btnClass} type="button" onClick={this.handleClick}>
                <Icon viewBox="0 0 200 200" name="geoPicker" />
            </button>
        );
    }
}

export class MediaUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange() {
        let { provider, media, onChange } = this.props;
        const uploadElem = this.refs.btn;
        const file = uploadElem.files[0];

        // Preview
        addImagePreview({ file })
        .then(previewURL => {
            media.urls.push(previewURL)
            this.setState({ inprocess: true })
        })
        .then(() => {
            // Upload
            uploadMedia({ provider, file })
            .then(id => {
                media.ids.push(id)
                onChange({ type: 'media', payload: media })
                this.setState({ inprocess: false })
            })
        })

        // Reset
        uploadElem.value = '';
    }
    render() {
        const { inprocess } = this.state;
        const btnStyle = inprocess ? { 'pointerEvents': 'none' } : null;
        const btnClass = classNames({
            'write__btn write__btn--media tips--deep--peace': true,
            'tips--inprocess': inprocess
        });

        return (
            <span>
                <label
                    style={btnStyle}
                    className={btnClass}
                    htmlFor="uploadMedia"
                    role="button"
                >
                    <Icon viewBox="0 0 200 200" name="camera" />
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

export class ToggleSensitive extends React.Component {
    constructor(props) {
        super(props)
        this.state = { selected: false }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        const { selected } = this.state;
        const { onChange } = this.props;

        this.setState({ selected: !selected })
        onChange({ type: 'sensitive', payload: !selected })
    }
    render() {
        const { selected } = this.state;
        const btnClass = classNames({
            'write__btn write__btn--left tips--deep--peace': true,
            'tips--active--peace': selected
        });

        return (
            <button className={btnClass} type="button" onClick={this.handleClick}>
                <Icon viewBox="0 0 200 200" name="sensitive" />
            </button>
        );
    }
}

export class ToggleWeiboEmotions extends React.Component {
    constructor(props) {
        super(props)
        this.state = { selected: false }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        const { selected } = this.state;
        const { onChange } = this.props;

        this.setState({ selected: !selected })
        onChange({ type: 'emotions', payload: !selected })
    }
    render() {
        const { selected } = this.state;
        const btnClass = classNames({
            'write__btn write__btn--left tips--deep--peace': true,
            'tips--active--peace': selected
        });

        return (
            <button className={btnClass} type="button" onClick={this.handleClick}>
                <Icon viewBox="0 0 200 200" name="emotions" />
            </button>
        );
    }
}

export class Submit extends React.Component {
    componentWillReceiveProps() {
        addClassTemporarily(this.refs.btn, 'write__btn--send--typing', 700)
    }
    render() {
        const { action, provider, status, submitting, onClick } = this.props;
        const { count, isOverLimitCount } = getCountInfo({ provider, status });
        const btnClass = classNames({
            'write__btn write__btn--send tips': true,
            [`icon--${provider}`]: true,
            'write__btn--send--sending': submitting
        })
        return (
            <button
                className={btnClass}
                type="button"
                data-count={count === 0 ? '' : count}
                disabled={isOverLimitCount || count === 0 && action !== 'retweet'}
                onClick={onClick}
                ref="btn"
            >
                <Icon viewBox="0 0 113 72" name="writing" />
            </button>
        );
    }
}