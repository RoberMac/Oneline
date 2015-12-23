import React from 'react';
import { Link } from 'react-router';

import history from '../../../utils/history';

export default class TransitionLink extends React.Component {
    constructor(props) {
        super(props)
        this.handleLinkClick = this.handleLinkClick.bind(this)
    }
    handleLinkClick(e) {
        e.preventDefault()

        const { to } = this.props;

        history.push(to.indexOf('settings') >= 0 ? '/settings' : '/home')
        setTimeout(() => {
            history.replace(to)
        }, 700)
    }
    render() {
        const { to, children } = this.props;
        return (
            <Link to={to} onClick={this.handleLinkClick}>
                {children}
            </Link>
        );
    }
}
