import React from 'react';
import { Link } from 'react-router';


import { Icon } from '../Utils/Icon';

export default class Menu extends React.Component {
    render() {
        return (
            <div
                ng-if="providerList.length > 0"
                className="menu menu--right vertically_center animate--faster"
            >
                <Link to="/">
                    <span className="menu__button btn animate--faster">
                        <Icon viewBox="0 0 200 200" name="ok" />
                    </span>
                </Link>
            </div>
        );
    }
}