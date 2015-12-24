import React from 'react';
import classNames from 'classnames';

// Helper
import { addClassTemporarily } from '../../../../utils/dom';
import { getCountInfo } from './helper';

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
            <button className={btnClass} type="button" onClick={this.handleClick} ref="btn">
                <Icon viewBox="0 0 200 200" name="geoPicker" />
            </button>
        );
    }
}
GeoPicker.propTypes = {
    onChange: React.PropTypes.func.isRequired
}

export class MediaUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false, selected: false }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {

    }
    render() {
        const { inprocess, selected } = this.state;
        const btnClass = classNames({
            'write__btn write__btn--left tips--deep--peace': true,
            'tips--active--peace': selected,
            'tips--inprocess': inprocess
        });

        return (
            <button className={btnClass} type="button" onClick={this.handleClick} ref="btn">
                <Icon viewBox="0 0 200 200" name="camera" />
            </button>
        );
    }
}
MediaUpload.propTypes = {
    onChange: React.PropTypes.func.isRequired
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
            <button className={btnClass} type="button" onClick={this.handleClick} ref="btn">
                <Icon viewBox="0 0 200 200" name="sensitive" />
            </button>
        );
    }
}
ToggleSensitive.propTypes = {
    onChange: React.PropTypes.func.isRequired
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
            <button className={btnClass} type="button" onClick={this.handleClick} ref="btn">
                <Icon viewBox="0 0 200 200" name="emotions" />
            </button>
        );
    }
}
ToggleWeiboEmotions.propTypes = {
    onChange: React.PropTypes.func.isRequired
}

export class Submit extends React.Component {
    componentWillReceiveProps() {
        addClassTemporarily(this.refs.btn, 'write__btn--send--typing', 700)
    }
    render() {
        const { provider, status, onClick } = this.props;
        const { count, isOverLimitCount } = getCountInfo({ provider, status });

        return (
            <button
                className="write__btn write__btn--send icon--weibo tips"
                type="button"
                data-count={count === 0 ? '' : count}
                disabled={count === 0 || isOverLimitCount}
                onClick={onClick}
                ref="btn"
            >
                <Icon viewBox="0 0 113 72" name="writing" />
            </button>
        );
    }
}