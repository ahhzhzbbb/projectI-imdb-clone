import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { ReviewForm } from '../../../components/features/review/ReviewForm';
import { ReviewCard } from '../../../components/features/review/ReviewCard';
import type { IReview, IUser } from '../../../types';

interface IReviewsTabProps {
    /** List of reviews */
    reviews: IReview[];
    /** Whether user is authenticated */
    isAuthenticated: boolean;
    /** Current user */
    user: IUser | null;
    /** Whether review form is shown */
    showForm: boolean;
    /** Whether user is editing a review */
    isEditing: boolean;
    /** Current review score */
    reviewScore: number;
    /** Current review content */
    reviewContent: string;
    /** Whether review is spoiler */
    isSpoiler: boolean;
    /** Callbacks */
    onShowForm: (show: boolean) => void;
    onScoreChange: (score: number) => void;
    onContentChange: (content: string) => void;
    onSpoilerChange: (spoiler: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onEdit: (review: IReview) => void;
    onDelete: () => void;
}

/**
 * ReviewsTab component - Reviews section with form and list
 */
export const ReviewsTab: React.FC<IReviewsTabProps> = ({
    reviews,
    isAuthenticated,
    user,
    showForm,
    isEditing,
    reviewScore,
    reviewContent,
    isSpoiler,
    onShowForm,
    onScoreChange,
    onContentChange,
    onSpoilerChange,
    onSubmit,
    onCancel,
    onEdit,
    onDelete,
}) => {
    const isOwnerOfReview = (review: IReview) =>
        review.username && user?.username && review.username === user.username;

    return (
        <div>
            {/* Review Form */}
            {showForm && isAuthenticated && (
                <ReviewForm
                    isEditing={isEditing}
                    score={reviewScore}
                    content={reviewContent}
                    isSpoiler={isSpoiler}
                    onScoreChange={onScoreChange}
                    onContentChange={onContentChange}
                    onSpoilerChange={onSpoilerChange}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
            )}

            {/* Write Review Button */}
            {isAuthenticated && !showForm && (
                <div className="mb-6">
                    <Button variant="primary" onClick={() => onShowForm(true)}>
                        <Plus size={18} className="mr-2" />
                        Write a Review
                    </Button>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-gray-900/30 rounded-lg">
                    <p className="mb-4">No reviews yet</p>
                    {isAuthenticated && !showForm && (
                        <Button variant="primary" onClick={() => onShowForm(true)}>
                            Be the first to review
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            isOwner={!!isOwnerOfReview(review)}
                            onEdit={() => onEdit(review)}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
