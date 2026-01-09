import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Film, Users, User, Settings, Tag, Clapperboard } from 'lucide-react';

/**
 * Admin Dashboard - Trang chính của admin panel
 */
export const AdminDashboard: React.FC = () => {
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
      title: 'Movie Genres',
      description: 'Attach genres to movies',
      icon: Clapperboard,
      link: '/admin/movie-genres',
      color: 'bg-cyan-600',
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
      title: 'Settings',
      description: 'System settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-600',
    },
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
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Movies</p>
            <p className="text-3xl font-black text-yellow-500">--</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-black text-yellow-500">--</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Actors</p>
            <p className="text-3xl font-black text-yellow-500">--</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Directors</p>
            <p className="text-3xl font-black text-yellow-500">--</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
