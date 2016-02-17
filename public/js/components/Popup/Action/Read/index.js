import React from 'react';

// Helpers
import { Action } from 'utils/api';
const initId = ({ provider, action, id }) => {
    switch (provider){
        case 'twitter':
            switch (action){
                case 'user':
                    return id;
                    break;
                case 'locations':
                    return window.encodeURIComponent(`place:${id}`);
                    break;
                case 'tags':
                    return window.encodeURIComponent(`#${id}`);
                    break;
            }
            break;
        case 'instagram':
        case 'weibo':
            return id;
            break;
    }
};

// Components
import Spin from 'components/Utils/Spin';
import Icon from 'components/Utils/Icon';
import User from './User';
import Tags from './Tags';
import Locations from './Locations';
const Locked = ({ provider }) => (
    <span
        className={`color--${provider}`}
        style={{
            position: 'absolute',
            top: 'calc(50% - 25px)',
            left: 'calc(50% - 25px)',
            height: 50,
            width: 50,
            display: 'inline-block',
            cursor: 'default',
        }}
    >
        <Icon name="locked" />
    </span>
);
export default class Read extends React.Component {
    constructor(props) {
        super(props)
        this.state = props.location.state || {
            showingPosts: [],
            user: {},
            isFetching: false,
            isFetchFail: false,
            isInitLoad: true,
            isLocked: false,
            minId: '',
            minDate: 0
        }
        this.loadPosts = this.loadPosts.bind(this);
    }
    loadPosts() {
        const { provider, action, id } = this.props;
        const { showingPosts, isFetching, minId, minDate } = this.state;

        if (isFetching) return;
        this.setState({ isFetching: true, isFetchFail: false })

        Action
        .get({
            provider,
            action,
            id: initId({ provider, action, id })
        }, minId ? { maxId: provider !== 'weibo' ? minId : minDate } : undefined)
        .then(res => {
            // Update State
            const user = res.user;
            const data = res.data.sort((a, b) => a.created_at < b.created_at ? 1 : -1);
            const lastPost = data[data.length - 1] && data[data.length - 1];
            const newState = {
                showingPosts: showingPosts.concat(data),
                user: user || this.state.user,
                isFetching: false,
                isInitLoad: false,
                minId: lastPost && lastPost.id_str,
                minDate: lastPost && lastPost.created_at
            };
            this.setState(newState)
            // Store State in History State
            const { history, location } = this.props;
            history.replace({
                pathname: location.pathname,
                search: location.search,
                state: newState
            })
        })
        .catch(err => {
            this.setState({ isFetching: false, isFetchFail: true, isLocked: true })
        })
    }
    componentDidMount() {
        if (this.state.isInitLoad) {
            this.loadPosts()
        }
    }
    render() {
        const { provider, action } = this.props;
        const { showingPosts, user, isInitLoad, isFetching, isFetchFail, isLocked } = this.state;

        let SelectRead;
        switch (action){
            case 'user':
                SelectRead = User;
                break;
            case 'locations':
                SelectRead = Locations;
                break;
            case 'tags':
                SelectRead = Tags;
                break;
        }

        return (
            <div>
                {!isInitLoad && (
                    <div className="read animate--enter">
                        <SelectRead showingPosts={showingPosts} user={user} {...this.props} />
                    </div>
                )}
                {isLocked && isInitLoad
                    ? <Locked provider={provider} />
                    : isInitLoad || showingPosts.length >= 7
                        ? <Spin
                            type="oldPosts"
                            provider={provider}
                            initLoad={isInitLoad}
                            isFetching={isFetching}
                            isFetchFail={isFetchFail}
                            onClick={this.loadPosts}
                        />
                    : null
                }
            </div>
        );
    }
}
