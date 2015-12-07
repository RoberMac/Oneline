import React from 'react';
import { connect } from 'react-redux';


class App extends React.Component {
    render() {
        const { dispatch, works, children } = this.props

        return (
            <div>
                {children}
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        works: state
    }
}

export default connect(mapStateToProps)(App)