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
  // Tạo/cập nhật rating cho episode
  rateEpisode: (data: IRatingRequest) =>
    apiClient.post<IRating>('/ratings', data),

  // Lấy rating của user cho episode
  getUserEpisodeRating: (episodeId: number | string) =>
    apiClient.get<IRating>(`/ratings/episode/${episodeId}`),

  // Xóa rating
  deleteRating: (ratingId: number | string) =>
    apiClient.delete<IRating>(`/ratings/${ratingId}`),

  // Lấy tất cả rating của user
  getUserRatings: () =>
    apiClient.get<IRating[]>('/ratings/user'),
};
