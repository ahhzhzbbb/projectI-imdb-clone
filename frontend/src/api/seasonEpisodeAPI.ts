import type { ISeason, IEpisode } from '../types';
import apiClient from './axiosConfig';

// Episode Request interface
export interface IEpisodeRequest {
    episodeNumber?: number;
    title: string;
    summary?: string;
    posterURL?: string;
    trailerURL?: string;
}

// Season API Endpoints
export const seasonAPI = {
    // Add a new season to a movie
    addSeason: (movieId: number | string) =>
        apiClient.post<ISeason>(`/season/${movieId}`),

    // Delete the last season of a movie
    deleteLastSeason: (movieId: number | string) =>
        apiClient.delete<ISeason>(`/season/${movieId}`),

    // Get season detail with episodes
    getSeasonDetail: (seasonId: number | string) =>
        apiClient.get<{ id: number; number: number; episodes: IEpisode[] }>(`/season/${seasonId}/episodes`),
};

// Episode API Endpoints
export const episodeAPI = {
    // Create a new episode in a season
    createEpisode: (seasonId: number | string, data: IEpisodeRequest) =>
        apiClient.post<IEpisode>(`/seasons/${seasonId}/episode`, data),

    // Update an episode
    updateEpisode: (episodeId: number | string, data: IEpisodeRequest) =>
        apiClient.put<IEpisode>(`/episode/${episodeId}`, data),

    // Delete an episode
    deleteEpisode: (episodeId: number | string) =>
        apiClient.delete<IEpisode>(`/episode/${episodeId}`),
};
