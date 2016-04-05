import React from 'react';
import classNames from 'classnames';

// Helpers
import { isWeibo } from 'utils/detect';
import { removeText, insertText } from './helper';

// Export
export default class Mentions extends React.Component {
    constructor(props) {
        super(props)
        this.insertMention = this.insertMention.bind(this)
    }
    insertMention(text) {
        const { provider, onChange } = this.props;
        const mentionRegex = {
            twitter: /@([\u4e00-\u9fa5\w-]*)$/, // 可匹配中文
            instagram: /@([\w\.]*)$/,
            weibo: /@([\u4e00-\u9fa5\w-]*)$/
        };

        removeText(mentionRegex[provider])
        insertText(text.trim() + ' ')

        onChange()
    }
    render() {
        const { mentions, provider, toolPopupLeft } = this.props;
        const popupClass = classNames({
            'write__mentions write__popup overflow--y animate--faster': true,
            'write__popup--left': toolPopupLeft,
            'write__popup--right': !toolPopupLeft
        });
        return (
            <div className={popupClass}>
                {isWeibo(provider)
                    ? mentions.map(item => (
                        <button
                            key={item}
                            onClick={this.insertMention.bind(null, item)}
                            type="button"
                        >
                            {item}
                        </button>
                    ))
                    : mentions.map(item => (
                        <button
                            key={item.s}
                            onClick={this.insertMention.bind(null, item.s)}
                            type="button"
                        >
                            {item.u || item.s}
                        </button>
                    ))
                }
            </div>
        );
    }
}