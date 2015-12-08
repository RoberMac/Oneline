import React from 'react';

// Components
import { Icon } from '../Utils/Icon';

let ReplicantBtn = ({ type, showReplicant }) => (
    <button
        className={`menu__button animate--faster replicant-icon--${type}`}
        onClick={showReplicant(type)}
        type="button"
    >
        <Icon viewBox="0 0 200 200" name={type} />
    </button>
);


// Export
export default class Replicant extends React.Component {
    showReplicant (type){
        // TODO
    }
    render() {
        const { activeProviders } = this.props;
        return (
            <div>
                {
                    activeProviders.length <= 0
                        ? null
                    : <ReplicantBtn type="deckard" showReplicant={this.showReplicant}/>
                }                
                <ReplicantBtn type="rachael" showReplicant={this.showReplicant}/>
            </div>
        );
    }
}
