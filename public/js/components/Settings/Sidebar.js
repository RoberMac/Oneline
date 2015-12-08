import React from 'react';
import { Link } from 'react-router';


import { Icon } from '../Utils/Icon';
import { Empty } from '../Utils/Empty';
import Replicant from './Replicant';


export const LeftSidebar = ({ activeProviders }) => {
    return activeProviders.length <= 0
        ? <Empty />
    : (
        <div className="menu menu--left vertically_center animate--faster">
            <Replicant activeProviders={activeProviders}/>
        </div>
    );
}

export const RightSidebar = ({ activeProviders }) => {
    return activeProviders.length <= 0
        ? <Empty />
    : (
        <div className="menu menu--right vertically_center animate--faster">
            <Link to="/">
                <span className="menu__button btn animate--faster">
                    <Icon viewBox="0 0 200 200" name="ok" />
                </span>
            </Link>
        </div>
    );
}