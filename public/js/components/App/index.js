import React from 'react';
import classNames from 'classnames';

import ScrollToTop from '../Utils/ScrollToTop';
export default ({ location, main, leftSidebar, rightSidebar }) => {
    const isHome = !/^\/settings/.test(location.pathname);
    const mainClass = classNames({
        'oneline oneline--enter animate--general': true,
        'oneline--timeline': isHome
    });
    const leftSidebarClass = classNames({
        'sidebar sidebar--left vertically_center animate--faster': true,
        'sidebar--timeline sidebar--timeline--left': isHome
    });
    const rightSidebarClass = classNames({
        'sidebar sidebar--right vertically_center animate--faster': true,
        'sidebar--timeline sidebar--timeline--right': isHome 
    });

    return (
        <div>
            {isHome && <ScrollToTop target=".spin--new" container=".oneline__wrapper" duration={700} />}

            <div className={mainClass}>
                {main}
            </div>

            <div className={leftSidebarClass}>
                {leftSidebar}
            </div>
            <div className={rightSidebarClass}>
                {rightSidebar}
            </div>
        </div>
    );
};