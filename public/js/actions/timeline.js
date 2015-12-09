export const REQUEST_TIMELINE = 'REQUEST_TIMELINE'
export const RECEIVE_TIMELINE = 'RECEIVE_TIMELINE'
export const ERROR_TIMELINE = 'ERROR_TIMELINE'

export const requestTimeline = () => ({ type: REQUEST_TIMELINE });
export const receiveTimeline = (posts) => ({ type: RECEIVE_TIMELINE, posts });
export const errorTimeline = () => ({ type: RECEIVE_TIMELINE });
