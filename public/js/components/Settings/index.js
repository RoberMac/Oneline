import React from 'react';

// Components
import SocialAuth from './SocialAuth';
import Replicant from './Replicant';
import Menu from './Menu';

// Export
export default class Settings extends React.Component {
    render() {
        return (
            <div>
                <div className="oneline oneline--enter overflow--y animate--general">
                    <SocialAuth providers={['twitter', 'instagram', 'weibo']} />
                    <Replicant />
                </div>
                <Menu />
            </div>
        );
    }
}
