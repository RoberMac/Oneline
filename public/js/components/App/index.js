import React from 'react';
import classNames from 'classnames';

export default ({ location, main, leftSidebar, rightSidebar }) => {
    const isHome = location.pathname.indexOf('settings') < 0;
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