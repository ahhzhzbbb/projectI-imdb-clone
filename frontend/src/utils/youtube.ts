/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export const getYouTubeId = (url: string): string | null => {
    if (!url) return null;

    // youtu.be/VIDEO_ID
    if (url.includes('youtu.be')) {
        const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    }

    // youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch')) {
        const match = url.match(/v=([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    }

    // youtube.com/embed/VIDEO_ID
    if (url.includes('youtube.com/embed')) {
        const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    }

    return null;
};

/**
 * Get YouTube thumbnail URL
 */
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'hq' | 'maxres' = 'maxres'): string => {
    const qualityMap = {
        default: 'default',
        hq: 'hqdefault',
        maxres: 'maxresdefault',
    };
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};
