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
        'sidebar sidebar--left center animate--faster': true,
        'sidebar--timeline sidebar--timeline--left': homePage,
    });
    const rightSidebarClass = classNames({
        'sidebar sidebar--right center animate--faster': true,
        'sidebar--timeline sidebar--timeline--right': homePage,
    });

    return (
        <section>
            <main className={mainClass}>
                {main}
            </main>

            <nav className={leftSidebarClass}>
                {leftSidebar}
            </nav>
            <nav className={rightSidebarClass}>
                {rightSidebar}
            </nav>
        </section>
    );
};
