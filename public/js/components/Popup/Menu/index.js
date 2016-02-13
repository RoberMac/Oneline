import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';

import metaData from 'utils/metaData';

// Components
import Icon from 'components/Utils/Icon';
const MenuRows = ({ data }) => (
    <div>
    {data.map((item, index) => {
        const { link, provider, icon } = item;
        const rowNum = data.length;
        const btnClass = classNames({
            'menu--row menu__btn btn tips animate--faster': true,
            [`menu--row-${rowNum}-${index + 1}`]: true,
            [`icon--${provider}`]: provider
        });
        return (
           <Link to={link} key={icon}>
                <span className={btnClass}>
                    <Icon name={icon} />
                </span>
            </Link>
        );
    })}
    </div>
);
const MenuSwitch = ({ currentProvider, activeProviders }) => {
    const hasTwitter   = activeProviders.indexOf('twitter') >= 0;
    const hasInstagram = activeProviders.indexOf('instagram') >= 0;
    const hasWeibo     = activeProviders.indexOf('weibo') >= 0;

    let data = [];
    switch (currentProvider){
        case 'twitter':
            hasInstagram ? data.push({ direction: 'left', provider: 'instagram' }) : null
            hasWeibo     ? data.push({ direction: 'right', provider: 'weibo' }) : null
            break;
        case 'instagram':
            hasWeibo     ? data.push({ direction: 'left', provider: 'weibo' }) : null
            hasTwitter   ? data.push({ direction: 'right', provider: 'twitter' }) : null
            break;
        case 'weibo':
            hasTwitter   ? data.push({ direction: 'left', provider: 'twitter' }) : null
            hasInstagram ? data.push({ direction: 'right', provider: 'instagram' }) : null
            break
    }

    return (
        <div>
        {data.map(item => {
            const { provider, direction } = item;
            const btnClass = classNames({
                'menu__btn menu__btn--switch tips--deep--peace': true,
                [`menu__btn--switch--${direction}`]: true,
                [`icon--${provider}`]: true
            })
            return (
               <Link to={`/home/${provider}`} key={direction}>
                    <span className={btnClass}>
                        <Icon name="2" />
                    </span>
                </Link>
            );
        })}
        </div>
    );
};
const _SettingsMenu = ({ activeProviders }) => {
    let data = [];
    if (activeProviders.length > 0){
        data.push({ link: '/settings/replicant/deckard', icon: 'menu_deckard' })
    }
    data.push({ link: '/settings/replicant/rachael', icon: 'menu_rachael' })

    return <MenuRows data={data} />;
}
const _HomeMenu = ({ params, activeProviders }) => {
    const provider = params.provider;
    const uid = metaData.get(`profile_${provider}`).uid;

    let data;
    switch (provider){
        case 'twitter':
            data = [
                { link: '/home/twitter/tweet', provider: 'twitter', icon: 'menu_tweet' },
                { link: `/home/twitter/user/${uid}`, provider: 'twitter', icon: 'menu_profile' },
                { link: '/home/twitter/search', provider: 'twitter', icon: 'menu_search' }
            ]
            break;
        case 'instagram':
            data = [
                { link: `/home/instagram/user/${uid}`, provider: 'instagram', icon: 'menu_profile' }
            ]
            break;
        case 'weibo':
            data = [
                { link: '/home/weibo/tweet', provider: 'weibo', icon: 'menu_tweet' },
                { link: `/home/weibo/user/${uid}`, provider: 'weibo', icon: 'menu_profile' }
            ]
            break
    }

    return (
        <div>
            <MenuRows data={data} />
            <MenuSwitch currentProvider={provider} activeProviders={activeProviders}/>
        </div>
    );
}

// Export
export const SettingsMenu = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(_SettingsMenu)
export const HomeMenu = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(_HomeMenu)