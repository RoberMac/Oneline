import createLazyLoad from 'react-lazyload';

export default createLazyLoad({
    eventType: 'scroll wheel',
    rateLimit: 'debounce',
    wait: 300,
    offset: 700
});