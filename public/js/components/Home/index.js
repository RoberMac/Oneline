import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Spin from '../Utils/Spin';

export default class Home extends React.Component {
    constructor (props){
        super(props)
        // TODO
    }
    componentWillMount() {
        // TODO: options: auth ?
    }
    componentDidMount() {
        // TODO: start fetch
    }
    render() {
        const { newPosts, oldPosts, showingPosts } = this.props;

        return (
            <div>
                <Spin type="newPosts" initLoad={true} loading={true}/>

                <Spin type="oldPosts" initLoad={true} loading={false}/>
            </div>
        );
    }
}

// Export
export default connect(
    state => {
        const { newPosts, oldPosts, showingPosts } = state.timeline;
        return { newPosts, oldPosts, showingPosts };
    },
    {}
)(Home)