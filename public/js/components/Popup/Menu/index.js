import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';

// Components
import Icon from '../../Utils/Icon';
const MenuRows = ({ metadata }) => (
    <div>
    {
        metadata.map((item, index) => {
            const { link, provider, icon } = item;
            const rowNum = metadata.length;
            const btnClass = classNames({
                'menu--row menu__btn btn tips animate--faster': true,
                [`menu--row-${rowNum}-${index + 1}`]: true,
                [`icon--${provider}`]: provider
            });
            return (
               <Link to={link} key={icon}>
                    <span className={btnClass} type="button">
                        <Icon viewBox="0 0 200 200" name={icon} />
                    </span>
                </Link>
            );
        })
    }
    </div>
);
const MenuSwitch = ({ currentProvider, activeProviders }) => {
    const hasTwitter   = activeProviders.indexOf('twitter') >= 0;
    const hasInstagram = activeProviders.indexOf('instagram') >= 0;
    const hasWeibo     = activeProviders.indexOf('weibo') >= 0;

    let metadata = [];
    switch (currentProvider){
        case 'twitter':
            hasInstagram ? metadata.push({ direction: 'left', provider: 'instagram' }) : null
            hasWeibo     ? metadata.push({ direction: 'right', provider: 'weibo' }) : null
            break;
        case 'instagram':
            hasWeibo     ? metadata.push({ direction: 'left', provider: 'weibo' }) : null
            hasTwitter   ? metadata.push({ direction: 'right', provider: 'twitter' }) : null
            break;
        case 'weibo':
            hasTwitter   ? metadata.push({ direction: 'left', provider: 'twitter' }) : null
            hasInstagram ? metadata.push({ direction: 'right', provider: 'instagram' }) : null
            break
    }

    return (
        <div>
        {
            metadata.map(item => {
                const { provider, direction } = item;
                const btnClass = classNames({
                    'menu__btn menu__btn--switch tips--deep--peace': true,
                    [`menu__btn--switch--${direction}`]: true,
                    [`icon--${provider}`]: true
                })
                return (
                    <button className={btnClass} key={direction} type="button">
                        <Icon viewBox="0 0 77 77" name="2" />
                    </button>
                );
            })
        }
        </div>
    );
};

// Export
export class SettingsMenu extends React.Component {
    render() {
        return (
            <MenuRows metadata={[
                { link: '/settings/replicant/deckard', icon: 'deckard' },
                { link: '/settings/replicant/rachael', icon: 'rachael' }
            ]} />
        );
    }
}
class _HomeMenu extends React.Component {
    render() {
        const { params, activeProviders } = this.props;
        let metadata;
        switch (params.provider){
            case 'twitter':
                metadata = [
                    { link: '/home/twitter/newTweet', provider: 'twitter', icon: 'newTweet' },
                    { link: '/home/twitter/user', provider: 'twitter', icon: 'profile' },
                    { link: '/home/twitter/notification', provider: 'twitter', icon: 'notification' }
                ]
                break;
            case 'instagram':
                metadata = [
                    { link: '/home/instagram/user', provider: 'instagram', icon: 'profile' }
                ]
                break;
            case 'weibo':
                metadata = [
                    { link: '/home/weibo/newTweet', provider: 'weibo', icon: 'newTweet' },
                    { link: '/home/weibo/user', provider: 'weibo', icon: 'profile' }
                ]
                break
        }

        return (
            <div>
                <MenuRows metadata={metadata} />
                <MenuSwitch currentProvider={params.provider} activeProviders={activeProviders}/>
            </div>
        );
    }
}
export const HomeMenu = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(_HomeMenu)