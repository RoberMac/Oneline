import { browserHistory as history } from 'react-router';

export default e => {
    const elem = e.target;

    if (elem.tagName !== 'A') return;

    const link = elem.getAttribute('href');
    const isInsideLink = /^\/(?!\/)/.test(link);

    if (isInsideLink) {
        e.preventDefault();
        history.push(link);
    } else {
        return;
    }
};
