import React from 'react';


export let App = ({ location, main, leftSidebar, rightSidebar }) => {
    const mainClass = location.pathname === '/' ? ' oneline--timeline' : '';
    const leftSidebarClass = location.pathname === '/' ? ' menu--timeline menu--timeline--left' : '';
    const rightSidebarClass = location.pathname === '/' ? ' menu--timeline menu--timeline--right' : '';
    return (
        <div>
            <div className={`oneline oneline--enter overflow--y animate--general${mainClass}`}>
                {main}
            </div>

            <div className={`menu menu--left vertically_center animate--faster${leftSidebarClass}`}>
                {leftSidebar}
            </div>
            <div className={`menu menu--right vertically_center animate--faster${rightSidebarClass}`}>
                {rightSidebar}
            </div>
        </div>
    );
};