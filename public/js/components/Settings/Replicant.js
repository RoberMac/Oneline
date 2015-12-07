import React from 'react';

// Components
import { Icon } from '../Utils/Icon';


export default class Replicant extends React.Component {
    showReplicant (type){
        // TODO
        console.log(type)
    }
    render() {
        const btnClass = 'replicant-icon replicant-icon--deckard tips--deep--peace';

        return (
            <div>
                <button
                    ng-if="providerList.length > 0"
                    className={btnClass}
                    type="button"
                    onClick={this.showReplicant('deckard')}
                >
                    <Icon viewBox="0 0 54 67" name="deckard" />
                </button>
                <button
                    className={btnClass}
                    type="button"
                    onClick={this.showReplicant('rachael')}
                >
                    <Icon viewBox="0 0 54 67" name="rachael" />
                </button>
            </div>
        );
    }
}
