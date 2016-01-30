import React from 'react';

export default class SelectText extends React.Component {
    constructor(props) {
        super(props)
        this.select = this.select.bind(this)
    }
    select() {
        const elem = this.refs.text;
        elem.setSelectionRange(0, elem.value.length)
    }
    componentDidMount() {
        this.select()
    }
    render() {
        return (
            <input
                type="text"
                value={this.props.value}
                ref="text"
                onClick={this.select}
                readOnly
            />
        );
    }
}