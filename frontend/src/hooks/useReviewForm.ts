import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewAPI } from '../api';
import { useAuth } from '../store/AuthContext';

interface UseReviewFormReturn {
    // Form state
    showForm: boolean;
    reviewScore: number;
    reviewContent: string;
    isSpoiler: boolean;
    editingReviewId: number | string | null;

    // Actions
    setShowForm: (show: boolean) => void;
    setReviewScore: (score: number) => void;
    setReviewContent: (content: string) => void;
    setIsSpoiler: (spoiler: boolean) => void;

    // Handlers
    handleSubmitReview: (e: React.FormEvent, movieId: string, onSuccess: () => void) => Promise<void>;
    handleDeleteReview: (movieId: string, onSuccess: () => void) => Promise<void>;
    startEditing: (reviewId: number | string, score: number, content: string, spoiler: boolean) => void;
    resetForm: () => void;
}

/**
 * Custom hook để quản lý review form state và logic
 */
export const useReviewForm = (): UseReviewFormReturn => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [reviewScore, setReviewScore] = useState(5);
    const [reviewContent, setReviewContent] = useState('');
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<number | string | null>(null);

    const resetForm = useCallback(() => {
        setReviewScore(5);
        setReviewContent('');
        setIsSpoiler(false);
        setShowForm(false);
        setEditingReviewId(null);
    }, []);

    const startEditing = useCallback((
        reviewId: number | string,
        score: number,
        content: string,
        spoiler: boolean
    ) => {
        setEditingReviewId(reviewId);
        setReviewScore(score);
        setReviewContent(content);
        setIsSpoiler(spoiler);
        setShowForm(true);
    }, []);

    const handleSubmitReview = useCallback(async (
        e: React.FormEvent,
        movieId: string,
        onSuccess: () => void
    ) => {
        e.preventDefault();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            if (editingReviewId) {
                await reviewAPI.updateReview(movieId, {
                    score: reviewScore,
                    content: reviewContent,
                    isSpoiler,
                    movieId: parseInt(movieId),
                });
            } else {
                await reviewAPI.createReview(movieId, {
                    score: reviewScore,
                    content: reviewContent,
                    isSpoiler,
                    movieId: parseInt(movieId),
                });
            }
            resetForm();
            onSuccess();
        } catch (err) {
            console.error('Failed to submit review:', err);
        }
    }, [isAuthenticated, navigate, editingReviewId, reviewScore, reviewContent, isSpoiler, resetForm]);

    const handleDeleteReview = useCallback(async (
        movieId: string,
        onSuccess: () => void
    ) => {
        try {
            await reviewAPI.deleteReview(movieId);
            onSuccess();
        } catch (err) {
            console.error('Failed to delete review:', err);
        }
    }, []);

    return {
        showForm,
        reviewScore,
        reviewContent,
        isSpoiler,
        editingReviewId,
        setShowForm,
        setReviewScore,
        setReviewContent,
        setIsSpoiler,
        handleSubmitReview,
        handleDeleteReview,
        startEditing,
        resetForm,
    };
};
