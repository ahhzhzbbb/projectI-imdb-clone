import type { IActor, IActorResponse, IDirector, IDirectorResponse, IGenre, IGenreRequest, IGenreResponse, IMovieGenreDTO } from '../types';
import apiClient from './axiosConfig';

// Actor API Endpoints
export const actorAPI = {
  getAllActors: () =>
    apiClient.get<IActorResponse>('/actors'),

  getActor: (actorId: number | string) =>
    apiClient.get<IActor>(`/actor/${actorId}`),

  createActor: (data: Partial<IActor>) =>
    apiClient.post<IActor>('/actor', data),

  updateActor: (actorId: number | string, data: Partial<IActor>) =>
    apiClient.put<IActor>(`/actor/${actorId}`, data),

  deleteActor: (actorId: number | string) =>
    apiClient.delete<IActor>(`/actor/${actorId}`),
};

// Director API Endpoints
export const directorAPI = {
  getAllDirectors: () =>
    apiClient.get<IDirectorResponse>('/directors'),

  getDirector: (directorId: number | string) =>
    apiClient.get<IDirector>(`/director/${directorId}`),

  createDirector: (data: Partial<IDirector>) =>
    apiClient.post<IDirector>('/director', data),

  updateDirector: (directorId: number | string, data: Partial<IDirector>) =>
    apiClient.put<IDirector>(`/director/${directorId}`, data),

  deleteDirector: (directorId: number | string) =>
    apiClient.delete<IDirector>(`/director/${directorId}`),
};

// Genre API Endpoints (matching backend GenreController and MovieGenreController)
export const genreAPI = {
  // GenreController endpoints
  getAllGenres: () =>
    apiClient.get<IGenreResponse>('/genres'),

  createGenre: (data: IGenreRequest) =>
    apiClient.post<IGenre>('/genre', data),

  deleteGenre: (genreId: number | string) =>
    apiClient.delete<IGenre>(`/genre/${genreId}`),

  // MovieGenreController endpoints
  getMoviesByGenre: (genreId: number | string) =>
    apiClient.get(`/genre/${genreId}/movies`),

  getGenresOfMovie: (movieId: number | string) =>
    apiClient.get<IGenre[]>(`/movie/${movieId}/genres`),

  addGenreToMovie: (movieId: number | string, genreId: number | string) =>
    apiClient.post<IMovieGenreDTO>(
      `/movie/${movieId}/genre/${genreId}`
    ),

  removeGenreFromMovie: (movieId: number | string, genreId: number | string) =>
    apiClient.delete<IMovieGenreDTO>(
      `/movie/${movieId}/genre/${genreId}`
    ),
};

// Movie Actor API Endpoints (matching backend MovieActorController)
export const movieActorAPI = {
  getActorsOfMovie: (movieId: number | string) =>
    apiClient.get<IActor[]>(`/movie/${movieId}/actors`),

  addActorToMovie: (movieId: number | string, actorId: number | string) =>
    apiClient.post(`/movie/${movieId}/actor/${actorId}`),

  removeActorFromMovie: (movieId: number | string, actorId: number | string) =>
    apiClient.delete(`/movie/${movieId}/actor/${actorId}`),

  getMoviesOfActor: (actorId: number | string) =>
    apiClient.get(`/actor/${actorId}/movies`),
};
