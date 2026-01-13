import type {
  IReview,
  IReviewRequest,
  IReviewResponse,
  IRating,
  IRatingRequest,
} from '../types';
import apiClient from './axiosConfig';

// Review API Endpoints
export const reviewAPI = {
  // Lấy tất cả review của phim
  getMovieReviews: (movieId: number | string) =>
    apiClient.get<IReviewResponse>(`/movie/${movieId}/reviews`),

  // Tạo review mới
  createReview: (movieId: number | string, data: IReviewRequest) =>
    apiClient.post<IReview>(`/movie/${movieId}/review`, data),

  // Cập nhật review
  updateReview: (movieId: number | string, data: IReviewRequest) =>
    apiClient.put<IReview>(`/movie/${movieId}/review`, data),

  // Xóa review
  deleteReview: (movieId: number | string) =>
    apiClient.delete<IReview>(`/movie/${movieId}/review`),

  // Lấy tất cả review của user
  getUserReviews: () =>
    apiClient.get<IReviewResponse>('/reviews/user'),
};

// Rating API Endpoints
export const ratingAPI = {
  // Tạo rating cho episode
  rateEpisode: (episodeId: number | string, data: IRatingRequest) =>
    apiClient.post<IRating>(`/episode/${episodeId}/rating`, data),

  // Cập nhật rating cho episode
  updateRating: (episodeId: number | string, data: IRatingRequest) =>
    apiClient.put<IRating>(`/episode/${episodeId}/rating`, data),

  // Xóa rating
  deleteRating: (episodeId: number | string) =>
    apiClient.delete<IRating>(`/episode/${episodeId}/rating`),

  // Lấy rating của user cho episode
  getUserRatingForEpisode: (episodeId: number | string) =>
    apiClient.get<IRating>(`/episode/${episodeId}/rating`),

  // Lấy tất cả rating của user
  getUserRatings: () =>
    apiClient.get<IRating[]>('/ratings/user'),
};
