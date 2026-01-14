import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { IActor } from '../../../types';

interface ICastTabProps {
    /** List of actors */
    actors: IActor[];
}

/**
 * CastTab component - Display cast/actors grid
 */
export const CastTab: React.FC<ICastTabProps> = ({ actors }) => {
    const navigate = useNavigate();

    if (!actors || actors.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12">
                <p>No cast information available.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actors.map((actor) => (
                <div
                    key={actor.id}
                    className="flex gap-4 p-4 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-colors border border-gray-800"
                >
                    {/* Actor Image */}
                    <div className="w-20 h-20 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                        {actor.imageUrl ? (
                            <img
                                src={actor.imageUrl}
                                alt={actor.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">
                                👤
                            </div>
                        )}
                    </div>

                    {/* Actor Info */}
                    <div className="flex-1">
                        <h4
                            onClick={() => navigate(`/actor/${actor.id}`)}
                            className="text-white font-semibold hover:text-blue-400 cursor-pointer"
                        >
                            {actor.name}
                        </h4>
                        {actor.introduction && (
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                {actor.introduction}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
