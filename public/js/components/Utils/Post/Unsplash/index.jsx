import React from 'react';

// Components
import Text from '../Utils/Text';
import Media from '../Utils/Media';
import Action from '../Utils/Action';
import { Avatar } from '../Utils/Avatar';

export const UnsplashPost = ({ post, highlight }) => (
    <div>
        {!post.avatarless && <Avatar provider="unsplash" {...post.user} />}
        <section className="post__content">
            <Media provider="unsplash" images={post.images} />
            <Text
                provider="unsplash"
                text={post.text}
                middlewares={[
                    {
                        order: 5,
                        middleware: 'highlight',
                        opts: { provider: 'unsplash', highlight },
                    },
                ]}
            />
        </section>

        <footer className="post__footer">
            <Action post={post} />
        </footer>
    </div>
);
