import React from 'react';

// Helpers
import { Action } from '../../../../utils/api';

// Components
import Spin from '../../../Utils/Spin';
import Icon from '../../../Utils/Icon';
import User from './User';
import Tags from './Tags';
import Locations from './Locations';
const Locked = ({ provider }) => (
    <span
        className={`icon--${provider}`}
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
        <Icon viewBox="0 0 40 40" name="locked" />
    </span>
);
export default class Read extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showingPosts: [],
            user: {},
            isFetching: false,
            isFetchFail: false,
            isInitLoad: true,
            isLocked: false,
            minId: ''
        }
        this.loadPosts = this.loadPosts.bind(this);
    }
    loadPosts() {
        const { provider, action, id } = this.props;
        const { showingPosts, isFetching, minId } = this.state;

        if (isFetching) return;
        this.setState({ isFetching: true, isFetchFail: false })

        Action
        .get({ provider, action, id }, minId ? { maxId: minId } : undefined)
        .then(res => {
            let { data, user } = res.body;

            data = data.sort((a, b) => a.created_at < b.created_at ? 1 : -1);

            this.setState({
                showingPosts: showingPosts.concat(data),
                user: user || this.state.user,
                isFetching: false,
                isInitLoad: false,
                minId: data[data.length - 1] && data[data.length - 1].id_str
            })
        })
        .catch(err => {
            __DEV__ && console.error(err)
            this.setState({ isFetching: false, isFetchFail: true, isLocked: true })
        })
    }
    componentDidMount() {
        this.loadPosts()
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
                {!isInitLoad
                    ? (
                        <div className="read animate--enter">
                            <SelectRead showingPosts={showingPosts} user={user} {...this.props} />
                        </div>
                    )
                    : null
                }
                {isLocked
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
