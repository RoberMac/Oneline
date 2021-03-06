import React from 'react';
import classNames from 'classnames';

// Helpers
import { addClassTemporarily } from 'utils/dom';
import { getCountInfo } from './helper';

// Components
import Icon from 'components/Utils/Icon';

// Export
export default class Submit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.status !== this.props.status) {
            addClassTemporarily(this.refs.btn, 'write__toolBar__btn--send--typing', 700);
        }
    }
    handleClick() {
        const { submitting, onClick } = this.props;
        !submitting && onClick();
    }
    render() {
        const { action, provider, status, submitting } = this.props;
        const { count, isOverLimitCount } = getCountInfo({ action, provider, status });
        const btnClass = classNames({
            'write__toolBar__btn write__toolBar__btn--send tips': true,
            [`color--${provider}`]: true,
            'write__toolBar__btn--send--sending': submitting,
        });

        return (
            <button
                className={btnClass}
                type="button"
                data-count={count === 0 ? '' : count}
                disabled={isOverLimitCount || count === 0 && action !== 'retweet'}
                onClick={this.handleClick}
                ref="btn"
            >
                <Icon name="writing" />
            </button>
        );
    }
}
