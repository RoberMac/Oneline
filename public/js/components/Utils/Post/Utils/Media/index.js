import React from 'react';

import Twitter from './Twitter';
import Instagram from './Instagram';
import Weibo from './Weibo';

const Medias = {
    twitter: Twitter,
    instagram: Instagram,
    weibo: Weibo
};

export default ({ provider, ...media }) => {
    const SelectMedia = Medias[provider];
    return <SelectMedia {...media} />
};