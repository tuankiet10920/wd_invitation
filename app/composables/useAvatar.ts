export const formatAvatar = (img?: string | null): string => {
    if (!img) return '/images/avatars/default-avatar.png';
    if (
        img.startsWith('http://') ||
        img.startsWith('https://') ||
        img.startsWith('data:') ||
        img.startsWith('blob:')
    ) {
        return img;
    }
    if (img.startsWith('/')) {
        return img;
    }
    return `/images/avatars/${img}`;
};
