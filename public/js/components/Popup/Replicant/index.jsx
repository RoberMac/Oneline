import { connect } from 'react-redux';

import { replaceTokenList } from 'state/actions/auth';

// Components
import _Deckard from './Deckard';
import _Rachael from './Rachael';

// Export
export const Deckard = connect(
    state => ({ activeProviders: state.auth.get('activeProviders') })
)(_Deckard);
export const Rachael = connect(
    state => ({ activeProviders: state.auth.get('activeProviders') }),
    { replaceTokenList }
)(_Rachael);
