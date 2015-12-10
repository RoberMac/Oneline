import React from 'react';

import './popup.css';

// Components

export default class Popup extends React.Component {
    render() {
        const { children } = this.props;

        return (
            <div className="popup animate--general">
                <div className="popup__wrapper overflow--y">
                    {children}
                </div>
            </div>
        );
    }
}