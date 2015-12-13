import React from 'react';
import classNames from 'classnames';

import './spin.css';

export default class Spin extends React.Component {
    render() {
        const { type, initLoad, loading, loadFail, provider } = this.props;
        const wrapperClass = classNames({
            'spin': true,
            'spin--initLoad': initLoad,
            'spin--new': type === 'newPosts',
            'spin--old': type === 'oldPosts'
        });
        const btnClass = classNames({
            'spin__btn spin__btn--count animate--faster': true,
            [`${provider ? 'spin__btn--' + provider : ''}`]: true,
            'spin__btn--loading': loading,
            'spin__btn--loading--fail': loadFail,
            'spin__btn--new': type === 'newPosts',
            'spin__btn--old': type === 'oldPosts'
        })
        return (
            <div className={wrapperClass}>
                <button
                    className={btnClass}
                    data-count=""
                    type="button"
                    onClick={this.props.onClick}
                >
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                            <circle cx="42.5" cy="100" r="15"/>
                            <circle cx="100" cy="100" r="15"/>
                            <circle cx="157.5" cy="100.5" r="15"/>
                        </g>
                    </svg>
                </button>
            </div>
        );
    }
}
