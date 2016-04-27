import React from 'react';
import classNames from 'classnames';

// Helpers
import { addClassTemporarily } from 'utils/dom';

// Components
import Icon from 'components/Utils/Icon';

// Export
export default class GeoPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { inprocess: false };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        const { inprocess } = this.state;
        const { onChange, selected } = this.props;

        if (inprocess) return;

        if (selected) {
            this.setState({ inprocess: false });
            onChange({ geo: {} });
        } else {
            this.setState({ inprocess: true });

            window.navigator.geolocation.getCurrentPosition(pos => {
                this.setState({ inprocess: false });

                const { latitude, longitude } = pos.coords;
                onChange({
                    geo: {
                        lat: latitude,
                        long: longitude,
                    },
                });
            }, () => {
                this.setState({ inprocess: false });
                addClassTemporarily(this.refs.btn, 'tips--error', 500);
            }, { maximumAge: 60000, timeout: 7000 });
        }
    }
    render() {
        const { action, selected } = this.props;
        const { inprocess } = this.state;
        const btnStyle = (
            inprocess || action === 'retweet'
                ? { pointerEvents: 'none', opacity: '.1' }
            : null
        );
        const btnClass = classNames({
            'write__toolBar__btn tips--deep--peace': true,
            'tips--active--peace': selected,
            'tips--inprocess': inprocess,
        });

        return (
            <button
                className={btnClass}
                style={btnStyle}
                onClick={this.handleClick}
                ref="btn"
                type="button"
            >
                <Icon name="geoPicker" />
            </button>
        );
    }
}
