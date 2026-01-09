import apiClient from './axiosConfig';
import type {
  IMovie,
  IMovieRequest,
  IMovieResponse,
  IMovieDetailResponse,
} from '../types';

// Movie API Endpoints
export const movieAPI = {
  // Lấy tất cả phim
  getAllMovies: () =>
    apiClient.get<IMovieResponse>('/movies'),

  // Lấy chi tiết phim với seasons và episodes
  getMovieDetail: (movieId: number | string) =>
    apiClient.get<IMovieDetailResponse>(`/movie/${movieId}/seasons`),

  // Tạo phim mới (chỉ admin)
  createMovie: (data: IMovieRequest) =>
    apiClient.post<IMovie>('/movie', data),

  // Cập nhật phim (chỉ admin)
  updateMovie: (movieId: number | string, data: IMovieRequest) =>
    apiClient.put<IMovie>(`/movie/${movieId}`, data),

  // Xóa phim (chỉ admin)
  deleteMovie: (movieId: number | string) =>
    apiClient.delete<IMovie>(`/movie/${movieId}`),

  // Tìm kiếm phim theo tên
  searchMovies: (query: string) =>
    apiClient.get<IMovieResponse>('/movies/search', {
      params: { q: query },
    }),

  // Lấy phim trending/phổ biến
  getTrendingMovies: (limit: number = 10) =>
    apiClient.get<IMovieResponse>('/movies/trending', {
      params: { limit },
    }),

  // Lấy phim theo thể loại
  getMoviesByGenre: (genreId: number | string) =>
    apiClient.get<IMovieResponse>('/movies/genre', {
      params: { genreId },
    }),
};
