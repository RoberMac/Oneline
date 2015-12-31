import React from 'react';

// Helpers
import { Action } from '../../../../utils/api';

// Components
import Spin from '../../../Utils/Spin';
import User from './User';
import Tag from './Tag';
import Location from './Location';

export default class Read extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showingPosts: [],
            isFetching: false,
            isFetchFail: false,
            isInitLoad: true,
            minId: {},
            minDate: {}
        }
        this.loadPosts = this.loadPosts.bind(this);
    }
    loadPosts() {
        const { provider, action, id } = this.props;
        const { showingPosts } = this.state;
        this.setState({ isFetching: true, isFetchFail: false })

        Action
        .get({ provider, action, id })
        .then(res => {
            
            this.setState({ isFetching: false, isInitLoad: false })
        })
        .catch(err => {
            __DEV__ && console.error(err)
            this.setState({ isFetching: false, isFetchFail: true })
        })
    }
    componentDidMount() {
        this.loadPosts()
    }
    render() {
        const { provider, action, id } = this.props;
        const { showingPosts, isInitLoad, isFetching, isFetchFail } = this.state;

        let SelectRead;
        switch (action){
            case 'user':
                SelectRead = User;
                break;
            case 'location':
                SelectRead = Location;
                break;
            case 'tag':
                SelectRead = Tag;
                break;
        }

        return (
            <div>
                {showingPosts.length > 0
                    ? <SelectRead posts={showingPosts} />
                    : null
                }
                <Spin
                    type="oldPosts"
                    provider={provider}
                    initLoad={isInitLoad}
                    isFetching={isFetching}
                    isFetchFail={isFetchFail}
                    onClick={this.loadPosts}
                />
            </div>
        );
    }
}
