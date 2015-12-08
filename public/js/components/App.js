import React from 'react';


export let App = ({ location, main, sidebar }) => {
    const timelineClassName = location.pathname === '/' ? ' oneline--timeline' : '';
    return (
        <div>
            <div className={`oneline oneline--enter overflow--y animate--general${timelineClassName}`}>
                {main}
            </div>
            {sidebar}
        </div>
    );
};