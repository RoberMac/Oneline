import React from 'react';

// Helper
import { extractMentions, isLeftPopup } from './helper';

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
            toolPopupLeft: false
        }
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleStateChange({ type, payload }) {
        this.setState({ [type]: payload })
    }
    handleTextChange() {
        const elem = this.refs.textarea;
        let _status = elem.value;

        const status = _status.trim().length > 0 ? _status : _status.trim();
        const mentions = extractMentions({
            status: status.slice(0, elem.selectionStart),
            provider: this.props.provider
        });
        const toolPopupLeft = isLeftPopup();
        this.setState({ status, mentions, toolPopupLeft })
    }
    handleSubmit() {
        const { status, geo, media, sensitive } = this.state;
        console.log('handleSubmit')
    }
    componentDidUpdate(prevProps, prevState) {
        this.refs.textarea.focus()
    }
    render() {
        const { provider } = this.props;
        const { status, mentions, emotions, toolPopupLeft } = this.state;
        const isTwitter = provider === 'twitter';
        const isWeibo   = provider === 'weibo';

        return (
            <form className="write">

                <textarea
                    className="write__textarea animate--general"
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                    required
                    onChange={this.handleTextChange}
                    ref="textarea"
                />
                <div className="write__textarea write__textarea--mirror"><span></span></div>

                <div className="write__toolBar">
                    <GeoPicker onChange={this.handleStateChange} />
                    { isTwitter ? <MediaUpload onChange={this.handleStateChange} /> : null }
                    { isTwitter ? <ToggleSensitive onChange={this.handleStateChange} /> : null }
                    { isWeibo ? <ToggleWeiboEmotions onChange={this.handleStateChange} /> : null }
                    <Submit provider={provider} status={status} onClick={this.handleSubmit} />
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
