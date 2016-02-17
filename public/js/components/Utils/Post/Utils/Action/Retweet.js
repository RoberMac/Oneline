import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

// Helpers
import numAbbr from 'utils/numAbbr';
import reduxStore from 'store';
import { updatePost } from 'actions/timeline';
import { Action } from 'utils/api';

// Components
import Icon from 'components/Utils/Icon';
const RetweetBtn = ({ provider, post }) => {
    const { id_str, retweet_count } = post;
    const btnClass = classNames({
        'post-action__btn btn color--steel tips--deep': true,
        'tips--inactive': !id_str
    })
    return (
        <Link to={`/home/${provider}/retweet/${id_str}`} state={post}>
            <span className={btnClass}>
                <Icon className="post-action__icon" name="retweet" />
                <span
                    className="post-action__count"
                    data-count={retweet_count > 0 ? numAbbr(retweet_count) : ''}
                />
            </span>
        </Link>
    );
};
class DeleteRetweetBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false }
        this.deleteRetweet = this.deleteRetweet.bind(this)
    }
    deleteRetweet() {
        const { inprocess } = this.state;
        const { provider, post } = this.props;
        const { id_str, retweet_count, retweeted_id_str } = post;

        if (inprocess) return;
        this.setState({ inprocess: true })

        Action
        .destroy({ action: 'tweet', provider, id: retweeted_id_str })
        .then(() => {
            reduxStore.dispatch(updatePost({
                id_str,
                retweeted: false,
                retweet_count: retweet_count - 1,
                retweeted_id_str: null
            }))
            // component will unmount, don't need `this.setState` anymore.
        })
        .catch(err => {
            addClassTemporarily(this.refs.btn, 'tips--error', 500)
            this.setState({ inprocess: false })
        })
    }
    render() {
        const { inprocess } = this.state;
        const { id_str, retweet_count, retweeted_id_str } = this.props.post;
        const btnClass = classNames({
            'post-action__btn tips--deep color--retweet tips--active': true,
            'tips--inactive': !(id_str && retweeted_id_str)
        })
        const iconClass = classNames({
            'post-action__icon': true,
            'animate--retweet': inprocess
        });
        return (
            <button className={btnClass} type="button" onClick={this.deleteRetweet} ref="btn">
                <Icon className={iconClass} name="retweet" />
                <span className="post-action__count" data-count={retweet_count > 0 ? retweet_count : ''} />
            </button>
        );
    }
}

// Export
export default props => (
    props.post.retweeted
        ? <DeleteRetweetBtn {...props} />
    : <RetweetBtn {...props} />
);