import React from 'react';
import type { IActor } from '../../../types';

interface IActorsCarouselProps {
    /** Actors to display */
    actors: IActor[];
    /** Callback when actor is clicked */
    onActorClick: (actorId: number | string) => void;
    /** Section title */
    title?: string;
}

/**
 * ActorsCarousel component - Horizontal scrollable actors list
 */
export const ActorsCarousel: React.FC<IActorsCarouselProps> = ({
    actors,
    onActorClick,
    title = '⭐ Popular Stars',
}) => {
    if (actors.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {actors.slice(0, 10).map((actor) => (
                    <div
                        key={actor.id}
                        onClick={() => onActorClick(actor.id)}
                        className="flex-shrink-0 w-28 group cursor-pointer"
                    >
                        <div className="w-28 h-28 bg-zinc-800 rounded-full overflow-hidden mb-2 ring-2 ring-transparent group-hover:ring-yellow-500 transition-all">
                            {actor.imageUrl ? (
                                <img
                                    src={actor.imageUrl}
                                    alt={actor.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-600">
                                    👤
                                </div>
                            )}
                        </div>
                        <p className="text-white text-sm text-center font-medium truncate group-hover:text-yellow-500 transition-colors">
                            {actor.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
