import React from 'react';
import classNames from 'classnames';

// Helpers
import { addClassTemporarily } from 'utils/dom';
import { getCountInfo } from './helper';

// Components
import Icon from 'components/Utils/Icon';

// Export
export default class Submit extends React.Component {
    componentWillReceiveProps() {
        addClassTemporarily(this.refs.btn, 'write__btn--send--typing', 700)
    }
    render() {
        const { action, provider, status, submitting, onClick } = this.props;
        const { count, isOverLimitCount } = getCountInfo({ action, provider, status });
        const btnClass = classNames({
            'write__btn write__btn--send tips': true,
            [`color--${provider}`]: true,
            'write__btn--send--sending': submitting
        });
        return (
            <button
                className={btnClass}
                type="button"
                data-count={count === 0 ? '' : count}
                disabled={isOverLimitCount || count === 0 && action !== 'retweet'}
                onClick={onClick}
                ref="btn"
            >
                <Icon name="writing" />
            </button>
        );
    }
}