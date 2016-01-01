import React from 'react';

import './popup.css';

export default class Popup extends React.Component {
    constructor (props){
        super(props)
        this.hidePopup = this.hidePopup.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
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
    componentDidMount (){
        window.addEventListener('keydown', this.handleKeyDown)
    }
    componentWillUnmount (){
        window.removeEventListener('keydown', this.handleKeyDown)
    }
    render() {
        const { children } = this.props;
        return (
            <div className="popup animate--general overflow--y">
                <div className="popup__wrapper" onClick={this.hidePopup}>
                    <div onClick={this.stopPropagation}>
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}