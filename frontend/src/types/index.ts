// User & Auth Types
export interface IRole {
  id: Long;
  roleName: string;
}

export interface IUser {
  userId: Long;
  username: string;
  phoneNumber?: string;
  createdAt: string;
  role: IRole;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ISignupRequest {
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface IAuthenticationResult {
  jwtCookie: string;
  response: {
    id: Long;
    username: string;
    email?: string;
    roles: string[];
  };
}

// Movie Types
export interface IGenre {
  id: Long;
  genreName?: string;
  name?: string;
  description?: string;
}

export interface IActor {
  id: Long;
  name: string;
  introduction?: string;
  imageUrl?: string;
}

export interface IDirector {
  id: Long;
  name: string;
  introduction?: string;
  imageUrl?: string;
}

export interface IMovie {
  id: Long;
  name: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  tvSeries: boolean;
  averageScore: number;
  reviewCount: number;
}

export interface IMovieDetail extends IMovie {
  director?: IDirector;
  genres: IGenre[];
  actors: IActor[];
  seasons: ISeason[];
}

// Season & Episode Types
export interface ISeason {
  id: Long;
  number: number;
  episodes: IEpisode[];
}

export interface IEpisode {
  id: Long;
  episodeNumber: number;
  title: string;
  summary?: string;
  posterURL?: string;
  trailerURL?: string;
  averageScore: number;
  ratingCount: number;
}

// Rating & Review Types
export interface IRating {
  id: Long;
  score: number;
  episodeId: Long;
  userId: Long;
}

export interface IReview {
  id: Long;
  score: number;
  content?: string;
  isSpoiler: boolean;
  createdAt: string;
  movieId: Long;
  userId: Long;
  username?: string;
}

// Wishlist Types
export interface IWishList {
  id: Long;
  userId: Long;
  movieId: Long;
  addedAt: string;
}

// API Response Types
export interface IMovieResponse {
  movies: IMovie[];
}

export interface IMovieDetailResponse {
  success: boolean;
  message: string;
  data: IMovieDetail;
}

export interface IReviewResponse {
  success?: boolean;
  message?: string;
  data?: IReview[];
  reviews?: IReview[];
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: IUser;
}

// DTO Request Types
export interface IMovieRequest {
  movieName: string;
  description?: string;
  imageUrl?: string;
  trailerUrl?: string;
  tvSeries: boolean;
}

export interface IReviewRequest {
  score: number;
  content?: string;
  isSpoiler?: boolean;
  movieId: Long;
}

export interface IRatingRequest {
  score: number;
  episodeId?: Long;
}

export interface IGenreRequest {
  name: string;
  description?: string;
}

export interface IGenreResponse {
  genres: IGenre[];
}

export interface IActorResponse {
  actors: IActor[];
}

export interface IDirectorResponse {
  directors: IDirector[];
}

export interface IMovieGenreDTO {
  id: Long;
  movieId: Long;
  genreId: Long;
  movieName?: string;
  genreName?: string;
}

// Utility Types
export type Long = number | string;

export interface IPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}
