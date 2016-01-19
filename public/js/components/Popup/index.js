import React from 'react';
import Swipeable from 'react-swipeable';

import './popup.css';
import Transition from 'components/Utils/Transition';

export default class Popup extends React.Component {
    constructor (props){
        super(props)
        this.hidePopup = this.hidePopup.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleSwipedLeft = this.handleSwipedLeft.bind(this)
        this.handleSwipedRight = this.handleSwipedRight.bind(this)
    }
    hidePopup (){
        const { history, location } = this.props;
        history.push(/settings/.test(location.pathname) ? '/settings' : '/home')
    }
    stopPropagation (e){
        e.stopPropagation()
    }
    handleKeyDown (e){
        if (e.keyCode === 27){ this.hidePopup() }
    }
    handleSwipedLeft(e) {
        e.stopPropagation()
        this.props.history.go()
    }
    handleSwipedRight(e) {
        e.stopPropagation()
        this.props.history.goBack()
    }
    componentDidMount (){
        window.addEventListener('keydown', this.handleKeyDown)
    }
    componentWillUnmount (){
        window.removeEventListener('keydown', this.handleKeyDown)
    }
    render() {
        const children = this.props.children;
        const pathname = this.props.location.pathname;
        return (
            <Swipeable
                className="popup overflow--y"
                onSwipedLeft={this.handleSwipedLeft}
                onSwipedRight={this.handleSwipedRight}
            >
                <div className="popup__wrapper" onClick={this.hidePopup}>
                    <div onClick={this.stopPropagation}>
                        {/(retweet|quote)/.test(pathname)
                            ? children
                            : <Transition>
                                {React.cloneElement(children, { key: pathname })}
                            </Transition>
                        }
                    </div>
                </div>
            </Swipeable>
        );
    }
}