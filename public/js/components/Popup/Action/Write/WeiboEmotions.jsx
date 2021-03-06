import React from 'react';
import classNames from 'classnames';

// Helpers
import { insertText } from './helper';
import Middlewares from 'components/Utils/Post/Utils/Text/helper';

// Export
export default class WeiboEmotions extends React.Component {
    constructor(props) {
        super(props);
        this.insertEmotions = this.insertEmotions.bind(this);
    }
    insertEmotions(text) {
        const { onChange } = this.props;

        insertText(`[${text}]`);

        onChange();
    }
    render() {
        const { toolPopupLeft } = this.props;
        const emotionsList = (
            '笑cry|微笑|嘻嘻|哈哈|可爱|可怜|挖鼻|吃惊|害羞|挤眼|'
            + '闭嘴|鄙视|爱你|泪|偷笑|亲亲|生病|太开心|白眼|右哼哼|'
            + '左哼哼|嘘|衰|委屈|吐|哈欠|抱抱|怒|疑问|馋嘴|拜拜|思考|'
            + '汗|困|睡|钱|失望|酷|色|哼|鼓掌|晕|悲伤|抓狂|黑线|阴险|怒骂|互粉|'
            + '心|伤心|猪头|熊猫|兔子|ok|耶|good|NO|赞|来|'
            + '弱|草泥马|给力|围观|威武|奥特曼|礼物|钟|话筒|蜡烛|蛋糕|'
            + '带着微博去旅行|最右|泪流满面|江南style|去旅行|doge|喵喵|'
            + '哆啦A梦花心|哆啦A梦害怕|哆啦A梦吃惊|静香微笑|大雄微笑|胖虎微笑|小夫微笑'
        ).split('|');
        const popupClass = classNames({
            'write__emotions write__popup overflow--y animate--faster': true,
            'write__popup--left': toolPopupLeft,
            'write__popup--right': !toolPopupLeft,
        });
        return (
            <div className={popupClass}>
                {emotionsList.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => this.insertEmotions(item)}
                        type="button"
                        dangerouslySetInnerHTML={{ __html: Middlewares.weiboEmotify(`[${item}]`) }}
                    >
                    </button>
                ))}
            </div>
        );
    }
}
