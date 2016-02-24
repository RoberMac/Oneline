import React from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

// Helpers
import reduxStore from 'state/store';
import { updateBase } from 'state/actions/base';

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.handleResize = this.handleResize.bind(this)
    }
    handleResize() {
        reduxStore.dispatch(updateBase({ WIDTH: { windowWidth: window.innerWidth } }))
    }
    componentDidMount() {
        this.debounceHandleResize = debounce(this.handleResize, 300)
        this.handleResize()

        window.addEventListener('resize', this.debounceHandleResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.debounceHandleResize);
    }
    render() {
        const { location, main, leftSidebar, rightSidebar } = this.props;
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
    }
};