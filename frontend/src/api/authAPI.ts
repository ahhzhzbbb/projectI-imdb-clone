import apiClient from './axiosConfig';
import type {
  ILoginRequest,
  ISignupRequest,
  IAuthResponse,
} from '../types';

// Auth API Endpoints
export const authAPI = {
  login: (data: ILoginRequest) =>
    apiClient.post<any>('/auth/login', data),

  signup: (data: ISignupRequest) =>
    apiClient.post<IAuthResponse>('/auth/signup', data),

  getCurrentUser: () =>
    apiClient.get<any>('/auth/user'),

  getCurrentUsername: () =>
    apiClient.get<string>('/auth/username'),

  logout: () => {
    localStorage.removeItem('jwtToken');
    return Promise.resolve();
  },
};
