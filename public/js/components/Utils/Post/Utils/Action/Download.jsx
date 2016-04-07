import React from 'react';

import numAbbr from 'utils/numAbbr';
import { selectDownloadLink } from 'utils/select';

import Icon from 'components/Utils/Icon';

export default ({ provider, id, count }) => (
    <a
        href={selectDownloadLink[provider]({ id })}
        target="_blank"
        role="button"
    >
        <span className="post-action__btn btn color--steel tips--deep">
            <Icon className="post-action__icon" name="download" />
            <span className="post-action__count" data-count={count > 0 ? numAbbr(count) : ''} />
        </span>
    </a>
);
