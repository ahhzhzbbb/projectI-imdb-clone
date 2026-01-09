import apiClient from './axiosConfig';
import type { IWishList } from '../types';

// Wishlist API Endpoints
export const wishlistAPI = {
  // Lấy danh sách yêu thích của user
  getUserWishlist: () =>
    apiClient.get<any>('/wishList/movies'),

  // Thêm phim vào danh sách yêu thích
  addToWishlist: (movieId: number | string) =>
    apiClient.post<IWishList>(`/wishlist/movie/${movieId}`),

  // Xóa phim khỏi danh sách yêu thích
  removeFromWishlist: (movieId: number | string) =>
    apiClient.delete<IWishList>(`/wishList/movie/${movieId}`),

  // Kiểm tra phim có trong danh sách yêu thích không
  isInWishlist: (movieId: number | string) =>
    apiClient.get<boolean>(`/wishlist/check/${movieId}`),
};
