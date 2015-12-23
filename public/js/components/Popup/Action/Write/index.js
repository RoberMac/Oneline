import React from 'react';

// Components
import Icon from '../../../Utils/Icon';
import GeoPicker from './GeoPicker';
import MediaUpload from './MediaUpload';
import ToggleSensitive from './ToggleSensitive';
import WeiboEmotions from './WeiboEmotions';


// Export
export default class index extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(type, payload) {
        console.log(type, payload)
    }
    render() {
        return (
            <form name="newTweetForm" className="write__form">

                <textarea className="write__textarea animate--general" type="text" name="tweet" autoComplete="off" spellCheck="false" required></textarea>
                <div className="write__textarea write__textarea--mirror"><span></span></div>

                <div className="write__toolBar">
                    <GeoPicker onChange={this.handleChange}/>
                    <button className="write__btn write__btn--send icon--weibo tips" type="submit" data-count disabled>
                        <Icon viewBox="0 0 113 72" name="writing" />
                    </button>
                </div>

                <div className="write__previews"></div>
            </form>
        );
    }
}
