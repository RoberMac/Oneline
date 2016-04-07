import React from 'react';
import classNames from 'classnames';

// Helpers
import { isHomePage } from 'utils/detect';

// Export
export default ({ location: { pathname }, main, leftSidebar, rightSidebar }) => {
    const homePage = isHomePage(pathname);
    const mainClass = classNames({
        'oneline oneline--enter animate--general': true,
        'oneline--timeline': homePage,
    });
    const leftSidebarClass = classNames({
        'sidebar sidebar--left vertically_center animate--faster': true,
        'sidebar--timeline sidebar--timeline--left': homePage,
    });
    const rightSidebarClass = classNames({
        'sidebar sidebar--right vertically_center animate--faster': true,
        'sidebar--timeline sidebar--timeline--right': homePage,
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
