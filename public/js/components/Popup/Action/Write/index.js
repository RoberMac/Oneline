import React from 'react';
import debounce from 'debounce';
import assign from 'object.assign';

// Helper
import { addClassTemporarily } from '../../../../utils/dom';
import {
    extractMentions, isLeftPopup,
    submitWrite, draft,
    initStatus, initLivePreview
} from './helper';

// Components
import Post from '../../../Utils/Post';
import { GeoPicker, MediaUpload, ToggleSensitive, ToggleWeiboEmotions, Submit } from './ToolBtns';
import { MediaPreview, Mentions, WeiboEmotions } from './ToolPopup';
import Transition from '../../../Utils/Transition';

// Export
export default class Write extends React.Component {
    constructor(props) {
        const { action, provider, post } = props;

        super(props)
        this.state = {
            status: '',
            mentions: [],
            geo: {},
            media: [],
            sensitive: false,
            emotions: false,
            livePreviewPost: initLivePreview({
                type: action,
                provider,
                status: '',
                media: [],
                post,
                livePreviewPost: {}
            }),
            toolPopupLeft: false,
            submitting: false
        }
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleStateChange(state) {
        if (Object.keys(state).indexOf('media') >= 0) {
            const { action, provider, post } = this.props;
            const { status, livePreviewPost } = this.state;
            assign(state, {
                livePreviewPost: initLivePreview({
                    type: action,
                    provider,
                    status,
                    media: state.media,
                    livePreviewPost,
                    post
                })
            })
        }
        this.setState(state)
    }
    handleTextChange() {
        const { action, provider, id, history, post } = this.props;
        const elem = this.refs.textarea;
        const _status = elem.value;

        let newStatus = _status.trim().length > 0 ? _status : _status.trim();
        let newMentions = extractMentions({
            status: newStatus.slice(0, elem.selectionStart),
            provider: this.props.provider
        });
        let newAction = action;
        let newGeo = this.state.geo;
        let newMedia = this.state.media;
        let newToolPopupLeft = isLeftPopup();

        // Retweet <==> Quote
        if (action === 'retweet' && newStatus){
            newAction = 'quote';
            newGeo = {};
            newMedia = [];
            history.replaceState(post, `/home/${provider}/quote/${id}`)
        } else if (action === 'quote' && newStatus === '') {
            newAction = 'retweet';
            newGeo = {};
            newMedia = [];
            history.replaceState(post, `/home/${provider}/retweet/${id}`)
        }

        // Update Live Preview
        let newLivePreviewPost = initLivePreview({
            type: newAction,
            provider,
            status: newStatus,
            media: newMedia,
            livePreviewPost: this.state.livePreviewPost,
            post
        })

        this.setState({
            status: newStatus,
            mentions: newMentions,
            geo: newGeo,
            media: newMedia,
            livePreviewPost: newLivePreviewPost,
            toolPopupLeft: newToolPopupLeft
        })
        this.refs.textarea.focus()
    }
    handleSubmit() {
        const { action, provider, history } = this.props;

        this.setState({ submitting: true })
        submitWrite({ ...this.state, ...this.props })
        .then(() => {
            history.push('/home')
            setTimeout(() => { draft.remove({ action, provider }) }, 700)
        })
        .catch(err => {
            __DEV__ && console.error(err)
            addClassTemporarily(this.refs.textarea, 'write__textarea--err', 500)
        })
        .then(() => {
            this.setState({ submitting: false })
        })
    }
    componentDidMount() {
        setTimeout(() => {
            initStatus({ ...this.props })
            this.handleTextChange()
        }, 700)
    }
    componentWillUnmount() {
        const { action, provider } = this.props;
        const { status } = this.state;
        // Save Draft
        status && draft.set({ action, provider, status })
    }
    render() {
        const { action, provider, id } = this.props;
        const {
            status, geo, media, mentions,
            emotions, livePreviewPost,
            toolPopupLeft, submitting
        } = this.state;
        const isTwitter = provider === 'twitter';
        const isWeibo   = provider === 'weibo';

        return (
            <div className="write">
                { action !== 'reply'
                    ? <div className="write__livePreview overflow--y">
                        <Post item={livePreviewPost}/>
                    </div>
                    : null
                }
                <form className="write__form">

                    <textarea
                        className="write__textarea animate--general"
                        type="text"
                        autoComplete="off"
                        spellCheck="false"
                        required={action !== 'retweet'}
                        disabled={submitting}
                        onChange={debounce(this.handleTextChange, 250)}
                        ref="textarea"
                    />
                    <div className="write__textarea write__textarea--mirror"><span></span></div>

                    <div className="write__toolBar">
                        { isTwitter
                            ? <ToggleSensitive action={action} onChange={this.handleStateChange} />
                            : null
                        }
                        <GeoPicker
                            action={action}
                            selected={Object.keys(geo).length > 0}
                            onChange={this.handleStateChange}
                        />
                        { isTwitter
                            ? <MediaUpload
                                provider={provider}
                                media={media}
                                action={action}
                                onChange={this.handleStateChange}
                            />
                            : null
                        }
                        { isWeibo ? <ToggleWeiboEmotions onChange={this.handleStateChange} /> : null }
                        <Submit
                            action={action}
                            provider={provider}
                            status={status}
                            submitting={submitting}
                            onClick={this.handleSubmit}
                        />
                    </div>

                    { media.length > 0
                            ? <MediaPreview media={media} onChange={this.handleStateChange} />
                    : null }

                    <Transition>
                    { mentions.length > 0
                        ? <Mentions
                            mentions={mentions}
                            provider={provider}
                            toolPopupLeft={toolPopupLeft}
                            onChange={this.handleTextChange}
                        />
                    : null }
                    </Transition>

                    <Transition>
                    { emotions && isWeibo
                        ? <WeiboEmotions
                            emotions={emotions}
                            toolPopupLeft={toolPopupLeft}
                            onChange={this.handleTextChange}
                        />
                    : null }
                    </Transition>
                </form>
            </div>
        );
    }
}
