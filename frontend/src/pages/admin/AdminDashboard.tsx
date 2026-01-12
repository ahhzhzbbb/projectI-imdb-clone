import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Film, Users, User, Settings, Tag, Loader, Tv } from 'lucide-react';
import { movieAPI, actorAPI, directorAPI, genreAPI } from '../../api';

interface IStats {
  totalMovies: number;
  totalActors: number;
  totalDirectors: number;
  totalGenres: number;
}

/**
 * Admin Dashboard - Main admin panel page
 */
export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<IStats>({
    totalMovies: 0,
    totalActors: 0,
    totalDirectors: 0,
    totalGenres: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [moviesRes, actorsRes, directorsRes, genresRes] = await Promise.all([
        movieAPI.getAllMovies(),
        actorAPI.getAllActors(),
        directorAPI.getAllDirectors(),
        genreAPI.getAllGenres(),
      ]);

      // Extract counts from responses
      const movies = moviesRes.data.movies || moviesRes.data || [];
      const actors = actorsRes.data.actors || actorsRes.data || [];
      const directors = directorsRes.data.directors || directorsRes.data || [];
      const genres = genresRes.data.genres || genresRes.data || [];

      setStats({
        totalMovies: Array.isArray(movies) ? movies.length : 0,
        totalActors: Array.isArray(actors) ? actors.length : 0,
        totalDirectors: Array.isArray(directors) ? directors.length : 0,
        totalGenres: Array.isArray(genres) ? genres.length : 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const adminMenus = [
    {
      title: 'Movies',
      description: 'Manage movies and TV series',
      icon: Film,
      link: '/admin/movies',
      color: 'bg-blue-600',
    },
    {
      title: 'Genres',
      description: 'Manage genres',
      icon: Tag,
      link: '/admin/genres',
      color: 'bg-orange-600',
    },
    {
      title: 'Actors',
      description: 'Manage actors',
      icon: Users,
      link: '/admin/actors',
      color: 'bg-purple-600',
    },
    {
      title: 'Directors',
      description: 'Manage directors',
      icon: User,
      link: '/admin/directors',
      color: 'bg-pink-600',
    },
    {
      title: 'Episodes',
      description: 'Manage TV series episodes',
      icon: Tv,
      link: '/admin/episodes',
      color: 'bg-teal-600',
    },
    {
      title: 'Settings',
      description: 'System settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-600',
    },
  ];

  const statsCards = [
    { label: 'Total Movies', value: stats.totalMovies, color: 'text-blue-500' },
    { label: 'Total Genres', value: stats.totalGenres, color: 'text-orange-500' },
    { label: 'Total Actors', value: stats.totalActors, color: 'text-purple-500' },
    { label: 'Total Directors', value: stats.totalDirectors, color: 'text-pink-500' },
  ];

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">Admin Panel</h1>
        <p className="text-gray-400 mt-2">Manage your IMDB Clone application</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminMenus.map((menu) => {
          const Icon = menu.icon;
          return (
            <Link
              key={menu.link}
              to={menu.link}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition-colors group"
            >
              <div
                className={`${menu.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon size={24} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{menu.title}</h3>
              <p className="text-gray-400 text-sm">{menu.description}</p>
              <div className="mt-4 text-yellow-500 group-hover:translate-x-2 transition-transform">
                →
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6"
            >
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader size={24} className="animate-spin text-yellow-500" />
                </div>
              ) : (
                <p className={`text-3xl font-black ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
