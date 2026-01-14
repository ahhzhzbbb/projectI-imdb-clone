import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import type { IReview } from '../../../types';

interface IReviewCardProps {
    /** Review data */
    review: IReview;
    /** Whether current user owns this review */
    isOwner: boolean;
    /** Callback when edit is clicked */
    onEdit?: () => void;
    /** Callback when delete is clicked */
    onDelete?: () => void;
}

/**
 * ReviewCard component - Display a single review
 */
export const ReviewCard: React.FC<IReviewCardProps> = ({
    review,
    isOwner,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-800">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    {/* Header: Score, Username, Date */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-semibold text-sm">
                                {review.score}/10
                            </span>
                        </div>
                        <span className="text-white font-medium">
                            {review.username || 'Anonymous'}
                        </span>
                        <span className="text-gray-600 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Spoiler Badge */}
                    {review.isSpoiler && (
                        <span className="inline-block bg-orange-600 text-white text-xs px-2 py-0.5 rounded mb-2">
                            ⚠️ Spoiler
                        </span>
                    )}

                    {/* Content */}
                    <p className="text-gray-300 leading-relaxed">{review.content}</p>
                </div>

                {/* Actions for owner */}
                {isOwner && (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="text-gray-500 hover:text-blue-500 p-2 transition-colors"
                                title="Edit review"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="text-gray-500 hover:text-red-500 p-2 transition-colors"
                                title="Delete review"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
