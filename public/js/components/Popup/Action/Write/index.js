import React from 'react';
import debounce from 'debounce';
import assign from 'object.assign';

// Helper
import { addClassTemporarily } from 'utils/dom';
import {
    extractMentions, isLeftPopup,
    submitWrite, draft,
    initStatus, initLivePreview
} from './helper';

// Components
import Post from 'components/Utils/Post';
import { GeoPicker, MediaUpload, ToggleSensitive, ToggleWeiboEmotions, Submit } from './ToolBtns';
import { MediaPreview, Mentions, WeiboEmotions } from './ToolPopup';
import Transition from 'components/Utils/Transition';

// Export
export default class Write extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: '',
            mentions: [],
            geo: {},
            media: [],
            sensitive: false,
            emotions: false,
            livePreviewPost: initLivePreview({
                type: props.action,
                provider: props.provider,
                status: '',
                media: [],
                post: props.location.state,
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
            const { action, provider } = this.props;
            const { status, livePreviewPost } = this.state;
            assign(state, {
                livePreviewPost: initLivePreview({
                    type: action,
                    provider,
                    status,
                    media: state.media,
                    livePreviewPost,
                    post: this.props.location.state
                })
            })
        }
        this.setState(state)
    }
    handleTextChange() {
        const { action, provider, id } = this.props;
        const textareaElem = this.refs.textarea;
        const _status = textareaElem.value;

        // Init New State
        let newStatus = _status.trim().length > 0 ? _status : _status.trim();
        let newAction = action;
        let newGeo = this.state.geo;
        let newMedia = this.state.media;
        // Retweet <==> Quote
        if (action === 'retweet' && newStatus || action === 'quote' && newStatus === ''){
            let { history, location } = this.props;
            newAction = action === 'retweet' ? 'quote' : 'retweet';
            newGeo = {};
            newMedia = [];
            history.replace({
                pathname: `/home/${provider}/${newAction}/${id}`,
                search: location.search,
                state: location.state
            })
        }
        // Update Live Preview
        let newLivePreviewPost = initLivePreview({
            type: newAction,
            provider,
            status: newStatus,
            media: newMedia,
            livePreviewPost: this.state.livePreviewPost,
            post: this.props.location.state
        })
        // Update State
        this.setState({
            status: newStatus,
            mentions: extractMentions({
                status: newStatus.slice(0, textareaElem.selectionStart),
                provider
            }),
            geo: newGeo,
            media: newMedia,
            livePreviewPost: newLivePreviewPost,
            toolPopupLeft: isLeftPopup()
        })
        textareaElem.focus()
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
                    ? <div className="write__livePreview animate--enter overflow--y">
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
