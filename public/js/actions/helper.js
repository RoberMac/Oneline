export const determineFetchFrom = ({ postsType, activeProviders, showingPosts, allPosts }) => {
    let fetchFrom, invalidProviders;

    if (postsType === 'newPosts'){
        const hasNewPostsInLocal = activeProviders.every(provider => {
            const maxPostDateInAllPosts = allPosts.maxDate[provider];
            const maxPostDateInShowingPosts = showingPosts.maxDate[provider];

            return maxPostDateInShowingPosts < maxPostDateInAllPosts;
        })

        fetchFrom = hasNewPostsInLocal ? 'local' : 'remote'
        invalidProviders = hasNewPostsInLocal ? [] : activeProviders

    } else if (postsType === 'oldPosts'){
        invalidProviders = activeProviders.filter(provider => {
            return timePointer - allPosts.minDate[provider] < timeRange
        });

        fetchFrom = invalidProviders.length <= 0 ? 'local' : 'remote'
    }

    return { fetchFrom, invalidProviders };
}
export const initShowingPosts = ({ postsType, allPosts,  }) => {
    posts = data.sort((a, b) => a.created_at < b.created_at ? 1 : -1)
    return {
        posts,
        maxId,
        minId
    };
}