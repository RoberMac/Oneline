/* eslint no-shadow: 0 */

import React from 'react';
import { Map, List } from 'immutable';

// Helpers
import { isBoolean } from 'utils/detect';
import { selectNextPageId } from 'utils/select';
import { Action } from 'utils/api';
const calcId = ({ provider, action, id }) => {
    let _id;
    switch (provider) {
        case 'twitter':
            switch (action) {
                case 'user':
                    _id = id;
                    break;
                case 'locations':
                    _id = window.encodeURIComponent(`place:${id}`);
                    break;
                case 'tags':
                    _id = window.encodeURIComponent(`#${id}`);
                    break;
                default:
                    break;
            }
            break;
        case 'weibo':
        case 'unsplash':
            _id = id;
            break;
        default:
            break;
    }

    return _id;
};
const initReadState = ({
    showingPosts, user,
    isFetching, isFetchFail, isInitLoad, isLocked,
    minId, minDate,
}) => {
    return Map({
        showingPosts: List(showingPosts || []),
        user: user || {},
        isFetching: isBoolean(isFetching) ? isFetching : false,
        isFetchFail: isBoolean(isFetchFail) ? isFetchFail : false,
        isInitLoad: isBoolean(isInitLoad) ? isInitLoad : true,
        isLocked: isBoolean(isLocked) ? isLocked : false,
        minId: minId || '',
        minDate: minDate || 0,
    });
};

// Components
import rerender from 'components/Utils/HoCs/ReRender';
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
        super(props);
        this.state = { readState: initReadState(props.location.state || {}) };
        this.fetchPosts = this.fetchPosts.bind(this);
    }
    componentDidMount() {
        if (this.state.readState.get('isInitLoad')) {
            this.fetchPosts();
        }
    }
    fetchPosts() {
        const { provider, action, id, history, location } = this.props;
        const { readState } = this.state;
        const minId = readState.get('minId');
        const minDate = readState.get('minDate');
        const nextPageId = selectNextPageId[provider]({
            minId,
            minDate,
            action,
            postsSize: readState.get('showingPosts').size,
        });

        if (readState.get('isFetching')) return;
        this.setState(({ readState }) => ({
            readState: readState.set('isFetching', true).set('isFetchFail', false),
        }));

        Action
        .get({
            provider,
            action,
            id: calcId({ provider, action, id }),
        }, minId ? { maxId: nextPageId } : undefined)
        .then(res => {
            // Update State
            const user = res.user;
            const posts = res.data.sort((a, b) => a.created_at < b.created_at ? 1 : -1);
            const lastPost = posts[posts.length - 1] && posts[posts.length - 1];
            const newState = readState.withMutations(map => {
                map
                .update('showingPosts', list => list.concat(posts))
                .set('isFetching', false)
                .set('isInitLoad', false)
                .set('minId', lastPost && lastPost.id_str)
                .set('minDate', lastPost && lastPost.created_at);

                user && map.set('user', user);
            });

            this.setState(() => ({ readState: newState }));
            // Store State in History State
            history.replace({
                pathname: location.pathname,
                search: location.search,
                state: newState.toJS(),
            });
        })
        .catch(() => {
            this.setState(({ readState }) => ({
                readState: readState.withMutations(map => {
                    map
                    .set('isFetching', false)
                    .set('isFetchFail', true)
                    .set('isLocked', true);
                }),
            }));
        });
    }
    render() {
        const { provider, action } = this.props;
        const { readState } = this.state;
        const showingPosts = readState.get('showingPosts');
        const user = readState.get('user');
        const isFetching = readState.get('isFetching');
        const isFetchFail = readState.get('isFetchFail');
        const isInitLoad = readState.get('isInitLoad');
        const isLocked = readState.get('isLocked');

        let SelectRead;
        switch (action) {
            case 'user':
                SelectRead = User;
                break;
            case 'locations':
                SelectRead = Locations;
                break;
            case 'tags':
                SelectRead = Tags;
                break;
            default:
                break;
        }

        return (
            <div onClick={e => e.stopPropagation()}>
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
export default rerender(Read);
