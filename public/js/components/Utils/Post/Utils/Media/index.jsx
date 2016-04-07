import React from 'react';

import Twitter from './Twitter';
import Instagram from './Instagram';
import Weibo from './Weibo';
import Unsplash from './Unsplash';

const Medias = {
    twitter: Twitter,
    instagram: Instagram,
    weibo: Weibo,
    unsplash: Unsplash,
};

export default ({ provider, ...media }) => {
    const SelectMedia = Medias[provider];
    return <SelectMedia {...media} />;
};
