import React from 'react';
import { Map, List } from 'immutable';

// Helpers
import { isBoolean } from 'utils/detect';
import { selectNextPageId } from 'utils/select';
import { Action } from 'utils/api';
const calcId = ({ provider, action, id }) => {
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
        case 'unsplash':
            return id;
            break;
    }
};
const initReadState = ({
    showingPosts, user,
    isFetching, isFetchFail, isInitLoad, isLocked,
    minId, minDate
}) => {

    return Map({
        showingPosts: List(showingPosts || []),
        user: user || {},
        isFetching: isBoolean(isFetching) ? isFetching : false,
        isFetchFail: isBoolean(isFetchFail) ? isFetchFail : false,
        isInitLoad: isBoolean(isInitLoad) ? isInitLoad : true,
        isLocked: isBoolean(isLocked) ? isLocked : false,
        minId: minId || '',
        minDate: minDate || 0
    });

};

// Components
import ReRender from 'components/Utils/HoCs/ReRender';
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
class Read extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: initReadState(props.location.state || {}) }
        this.fetchPosts = this.fetchPosts.bind(this);
    }
    fetchPosts() {
        const { provider, action, id, history, location } = this.props;
        const { data } = this.state;
        const minId = data.get('minId');
        const minDate = data.get('minDate');
        const nextPageId = selectNextPageId[provider]({
            minId,
            minDate,
            action,
            postsSize: data.get('showingPosts').size
        });

        if (data.get('isFetching')) return;
        this.setState(({ data }) => ({
            data: data.set('isFetching', true).set('isFetchFail', false)
        }))

        Action
        .get({
            provider,
            action,
            id: calcId({ provider, action, id })
        }, minId ? { maxId: nextPageId } : undefined)
        .then(res => {
            // Update State
            const user = res.user;
            const posts = res.data.sort((a, b) => a.created_at < b.created_at ? 1 : -1);
            const lastPost = posts[posts.length - 1] && posts[posts.length - 1];
            const newState = data.withMutations(map => {
                map
                .update('showingPosts', list => list.concat(posts))
                .set('isFetching', false)
                .set('isInitLoad', false)
                .set('minId', lastPost && lastPost.id_str)
                .set('minDate', lastPost && lastPost.created_at)

                user ? map.set('user', user) : null
            });

            this.setState(() => ({ data: newState }))
            // Store State in History State
            history.replace({
                pathname: location.pathname,
                search: location.search,
                state: newState.toJS()
            })
        })
        .catch(err => {
            this.setState(({ data }) => ({
                data: data.withMutations(map => {
                    map
                    .set('isFetching', false)
                    .set('isFetchFail', true)
                    .set('isLocked', true)
                })
            }))
        })
    }
    componentDidMount() {
        if (this.state.data.get('isInitLoad')) {
            this.fetchPosts()
        }
    }
    render() {
        const { provider, action } = this.props;
        const { data } = this.state;
        const showingPosts = data.get('showingPosts');
        const user = data.get('user');
        const isFetching = data.get('isFetching');
        const isFetchFail = data.get('isFetchFail');
        const isInitLoad = data.get('isInitLoad');
        const isLocked = data.get('isLocked');

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
                    : isInitLoad || showingPosts.size >= 7
                        ? <Spin
                            type="oldPosts"
                            provider={provider}
                            initLoad={isInitLoad}
                            isFetching={isFetching}
                            isFetchFail={isFetchFail}
                            onClick={this.fetchPosts}
                        />
                    : null
                }
            </div>
        );
    }
}
Read.displayName = 'Read';

// Export
export default ReRender(Read);