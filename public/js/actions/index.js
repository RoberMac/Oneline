import { TOGGLE_AUTH, TOGGLE_REPLICANT }  from '../constants/ActionTypes';

/*
 * action creators
 */
export function toggleAuth(provider) {
    return { type: TOGGLE_AUTH, provider }
}

export function toggleReplicant(isActive) {
    return { type: TOGGLE_REPLICANT, isActive }
}