/**
 * Route
 *
 */
export const isHomePage = pathname => /home/i.test(pathname);
export const isSettingsPage = pathname => /settings/i.test(pathname);
export const isPopupPage = pathname => !/(home|settings)\/?$/i.test(pathname);

/**
 * Provider
 *
 */
export const isTwitter = provider => /twitter/i.test(provider);
export const isInstagram = provider => /instagram/i.test(provider);
export const isWeibo = provider => /weibo/i.test(provider);
export const isUnsplash = provider => /unsplash/i.test(provider);