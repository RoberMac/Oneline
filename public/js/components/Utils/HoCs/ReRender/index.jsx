import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default ComposeComponent => class extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const displayName = ComposeComponent.displayName;

        __DEV__ && console.time(`[shallowCompare: ${displayName}]`)
        const shouldUpdate = shallowCompare(this, nextProps, nextState);
        __DEV__ && console.timeEnd(`[shallowCompare: ${displayName}]`)

        __DEV__ && shouldUpdate && console.log(`%c [ComponentUpdate]: ${displayName}`, 'color: red')

        return shouldUpdate;
    }
    render() {
        return <ComposeComponent {...this.props} {...this.state} />
    }
}