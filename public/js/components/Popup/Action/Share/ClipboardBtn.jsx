import React, { Component } from 'react';
import ClassList from 'classlist';
import Clipboard from 'clipboard';

import { addClassTemporarily } from 'utils/dom';

import Icon from 'components/Utils/Icon';

export default class ClipboardBtn extends Component {
    componentDidMount() {
        this.clipboard = new Clipboard(this.refs.btn);

        this.clipboard.on('success', e => {
            addClassTemporarily(this.refs.btn, 'tips--active', 500)
            // Cut (due to target is a controled <textarea>)
            document.querySelector('textarea').value = ''
        })

        // gracefully degrades for Safari
        this.clipboard.on('error', e => {
            const btnElem = this.refs.btn;
            const btnClassList = new ClassList(btnElem);

            if (btnClassList.contains('tips--active')){
                btnClassList.remove('tips--active')
                e.clearSelection()
            } else {
                btnClassList.toggle('tips--active')
            }
        })
    }
    componentWillUnmount() {
        this.clipboard.destroy();
    }
    render() {
        return (
            <button
                className="share__btn tips--deep--peace"
                type="button"
                data-clipboard-target=".share__text"
                ref="btn"
            >
                <Icon className="animate--faster" name="clipboard" />
            </button>
        );
    }
}