import React, { useState } from 'react';
import { Play, Film } from 'lucide-react';
import { getYouTubeId, getYouTubeThumbnail } from '../../../utils/youtube';

interface ITrailerPlayerProps {
    /** YouTube trailer URL */
    trailerUrl?: string;
    /** Height of the player */
    height?: string;
}

/**
 * TrailerPlayer component - YouTube video player with thumbnail preview
 */
export const TrailerPlayer: React.FC<ITrailerPlayerProps> = ({
    trailerUrl,
    height = '100%',
}) => {
    const [showTrailer, setShowTrailer] = useState(false);
    const videoId = trailerUrl ? getYouTubeId(trailerUrl) : null;

    if (!videoId) {
        return (
            <div
                className="bg-gray-900 rounded-lg flex items-center justify-center text-gray-500"
                style={{ height }}
            >
                <div className="text-center">
                    <Film size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No trailer available</p>
                </div>
            </div>
        );
    }

    if (showTrailer) {
        return (
            <div
                className="bg-black rounded-lg overflow-hidden shadow-2xl"
                style={{ height }}
            >
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="Movie Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div
            className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer group relative shadow-2xl"
            style={{ height }}
            onClick={() => setShowTrailer(true)}
        >
            <img
                src={getYouTubeThumbnail(videoId, 'maxres')}
                alt="Trailer thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = getYouTubeThumbnail(videoId, 'hq');
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
                <div>
                    <span className="font-semibold">Play trailer with sound</span>
                    <span className="text-gray-300 text-sm ml-2">1:56</span>
                </div>
            </div>
        </div>
    );
};
