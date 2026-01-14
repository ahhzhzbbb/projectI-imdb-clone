import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import type { ISeason, IEpisode } from '../../../types';

interface IEpisodesTabProps {
    /** Whether the movie is a TV series */
    isTvSeries: boolean;
    /** List of seasons */
    seasons: ISeason[];
    /** Currently selected season number */
    selectedSeason: number;
    /** Callback when season is selected */
    onSeasonSelect: (seasonNumber: number) => void;
}

/**
 * EpisodesTab component - Display seasons and episodes for TV series
 */
export const EpisodesTab: React.FC<IEpisodesTabProps> = ({
    isTvSeries,
    seasons,
    selectedSeason,
    onSeasonSelect,
}) => {
    const navigate = useNavigate();

    if (!isTvSeries || !seasons || seasons.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12">
                <Film size={48} className="mx-auto mb-4 opacity-50" />
                <p>This is a movie, not a TV series.</p>
            </div>
        );
    }

    const currentSeason = seasons.find((s) => s.number === selectedSeason);

    const handleEpisodeClick = (episode: IEpisode) => {
        // Store episode data in sessionStorage for EpisodeDetailPage
        sessionStorage.setItem(`episode_${episode.id}`, JSON.stringify(episode));
        navigate(`/episode/${episode.id}`);
    };

    return (
        <div>
            {/* Season Pills */}
            <div className="flex gap-2 mb-6">
                {seasons.map((season) => (
                    <button
                        key={season.id}
                        onClick={() => onSeasonSelect(season.number)}
                        className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${selectedSeason === season.number
                                ? 'bg-yellow-500 text-black'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        {season.number}
                    </button>
                ))}
            </div>

            {/* Episodes List */}
            <div className="space-y-4">
                {currentSeason?.episodes?.map((episode) => (
                    <div
                        key={episode.id}
                        onClick={() => handleEpisodeClick(episode)}
                        className="flex gap-4 p-4 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-colors border border-gray-800 cursor-pointer hover:border-yellow-500/50"
                    >
                        {/* Episode Thumbnail */}
                        <div className="w-40 h-24 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                            {episode.posterURL ? (
                                <img
                                    src={episode.posterURL}
                                    alt={episode.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <Film size={24} />
                                </div>
                            )}
                        </div>

                        {/* Episode Info */}
                        <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">
                                S{selectedSeason}.E{episode.episodeNumber} · {episode.title}
                            </h4>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                                {episode.summary || 'No description available.'}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">★</span>
                                    <span className="text-white font-medium">
                                        {(episode.averageScore ?? 0).toFixed(1)}/10
                                    </span>
                                </div>
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    ☆ Rate
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
