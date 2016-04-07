import React from 'react';
import { connect } from 'react-redux';

// Helpers
import { isUnsplash } from 'utils/detect';

// Components
import MenuRows from './MenuRows';
const _SettingsMenu = ({ activeProviders }) => {
    let rowsData = [];

    if (activeProviders.length > 0) {
        rowsData.push({ link: '/settings/replicant/deckard', iconName: 'menu_deckard' });
    }

    rowsData.push({ link: '/settings/replicant/rachael', iconName: 'menu_rachael' });

    return <MenuRows data={rowsData} />;
};
const _HomeMenu = ({ activeProviders }) => {
    const rowsData = activeProviders.map(provider => ({
        provider,
        link: `/home/${provider}`,
        iconType: 'menu',
    }));

    return <MenuRows data={rowsData} />;
};
const _ProviderMenu = ({ params, PROFILE }) => {
    const provider = params.provider;
    const { uid, screen_name } = PROFILE[provider];

    const ROW_TWEET = {
        provider,
        link: `/home/${provider}/tweet`,
        iconName: 'menu_tweet',
    };
    const ROW_PROFILE = {
        provider,
        link: `/home/${provider}/user/${isUnsplash(provider) ? screen_name : uid}`,
        iconName: 'menu_profile',
    };
    const ROW_SEARCH = {
        provider,
        link: `/home/${provider}/search`,
        iconName: 'menu_search',
    };

    let rowsData = [];
    switch (provider) {
        case 'twitter':
            rowsData.push(ROW_TWEET, ROW_PROFILE, ROW_SEARCH);
            break;
        case 'weibo':
            rowsData.push(ROW_TWEET, ROW_PROFILE);
            break;
        case 'instagram':
        case 'unsplash':
            rowsData.push(ROW_PROFILE, ROW_SEARCH);
            break;
        default:
            break;
    }

    return <MenuRows data={rowsData} />;
};

// Export
export const SettingsMenu = connect(
    state => ({ activeProviders: state.auth.get('activeProviders') })
)(_SettingsMenu);
export const HomeMenu = connect(
    state => ({ activeProviders: state.auth.get('activeProviders') })
)(_HomeMenu);
export const ProviderMenu = connect(
    state => ({ PROFILE: state.base.get('PROFILE') })
)(_ProviderMenu);
