import React from 'react';
import { Button } from '../../common/Button';

interface IReviewFormProps {
    /** Whether user is editing an existing review */
    isEditing: boolean;
    /** Current score value (1-10) */
    score: number;
    /** Current content value */
    content: string;
    /** Whether review contains spoilers */
    isSpoiler: boolean;
    /** Callback when score changes */
    onScoreChange: (score: number) => void;
    /** Callback when content changes */
    onContentChange: (content: string) => void;
    /** Callback when spoiler flag changes */
    onSpoilerChange: (isSpoiler: boolean) => void;
    /** Callback when form is submitted */
    onSubmit: (e: React.FormEvent) => void;
    /** Callback when form is cancelled */
    onCancel: () => void;
}

/**
 * ReviewForm component - Form for creating/editing reviews
 */
export const ReviewForm: React.FC<IReviewFormProps> = ({
    isEditing,
    score,
    content,
    isSpoiler,
    onScoreChange,
    onContentChange,
    onSpoilerChange,
    onSubmit,
    onCancel,
}) => {
    return (
        <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
                {isEditing ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <form onSubmit={onSubmit}>
                {/* Rating Stars */}
                <div className="mb-6">
                    <label className="text-yellow-500 font-semibold block mb-3 uppercase text-sm">
                        Rate This
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => onScoreChange(num)}
                                    className={`text-2xl transition-colors ${num <= score ? 'text-yellow-400' : 'text-gray-700'
                                        } hover:text-yellow-400`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <span className="text-white font-bold">{score}/10</span>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={(e) => onContentChange(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg h-32 focus:outline-none focus:border-yellow-500 resize-none"
                    />
                </div>

                {/* Spoiler Checkbox */}
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="spoiler"
                        checked={isSpoiler}
                        onChange={(e) => onSpoilerChange(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="spoiler" className="text-gray-400 text-sm">
                        Contains spoilers
                    </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Update Review' : 'Submit Review'}
                    </Button>
                    <Button variant="secondary" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};
