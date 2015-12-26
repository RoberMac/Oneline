import React from 'react';

// Helper
import history from '../../../../utils/history'
import { addClassTemporarily } from '../../../../utils/dom';
import { extractMentions, isLeftPopup, submitWrite, draft, initStatus } from './helper';

// Components
import { GeoPicker, MediaUpload, ToggleSensitive, ToggleWeiboEmotions, Submit } from './ToolBtns';
import { Mentions, WeiboEmotions } from './ToolPopup';
import Transition from '../../../Utils/Transition';

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
            toolPopupLeft: false,
            submitting: false
        }
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleStateChange({ type, payload }) {
        this.setState({ [type]: payload })
    }
    handleTextChange() {
        const { action, provider, id } = this.props;
        const elem = this.refs.textarea;
        let _status = elem.value;

        // Update State
        const status = _status.trim().length > 0 ? _status : _status.trim();
        const mentions = extractMentions({
            status: status.slice(0, elem.selectionStart),
            provider: this.props.provider
        });
        const toolPopupLeft = isLeftPopup();
        this.setState({ status, mentions, toolPopupLeft })

        // Retweet <==> Quote
        if (action === 'retweet' && status){
            history.replace(`/home/${provider}/quote/${id}`)
        } else if (action === 'quote' && status === '') {
            history.replace(`/home/${provider}/retweet/${id}`)
        }

        this.refs.textarea.focus()
    }
    handleSubmit() {
        this.setState({ submitting: true })
        submitWrite({ ...this.state, ...this.props })
        .then(() => {
            //TODO: Clean Draft
            history.push('/home')
        })
        .catch(err => {
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
        draft.set({ action, provider, status })
    }
    render() {
        const { action, provider, id } = this.props;
        const { status, mentions, emotions, toolPopupLeft, submitting } = this.state;
        const isTwitter = provider === 'twitter';
        const isWeibo   = provider === 'weibo';

        return (
            <form className="write">

                <textarea
                    className="write__textarea animate--general"
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                    required={action !== 'retweet'}
                    disabled={submitting}
                    onChange={this.handleTextChange}
                    ref="textarea"
                />
                <div className="write__textarea write__textarea--mirror"><span></span></div>

                <div className="write__toolBar">
                    <GeoPicker onChange={this.handleStateChange} />
                    { isTwitter ? <MediaUpload onChange={this.handleStateChange} /> : null }
                    { isTwitter ? <ToggleSensitive onChange={this.handleStateChange} /> : null }
                    { isWeibo ? <ToggleWeiboEmotions onChange={this.handleStateChange} /> : null }
                    <Submit
                        action={action}
                        provider={provider}
                        status={status}
                        submitting={submitting}
                        onClick={this.handleSubmit}
                    />
                </div>

                <div className="write__previews"></div>

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
        );
    }
}
