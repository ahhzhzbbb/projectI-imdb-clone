import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import type { IActor, IMovie } from '../../types';
import { actorAPI, movieActorAPI } from '../../api';
import { Edit2, Trash2, Plus, X, Star, Film, ArrowLeft } from 'lucide-react';

/**
 * Admin Actors Management
 */
export const AdminActorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [actors, setActors] = useState<IActor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    introduction: '',
    imageUrl: '',
  });

  // Actor detail modal states
  const [selectedActor, setSelectedActor] = useState<IActor | null>(null);
  const [actorMovies, setActorMovies] = useState<IMovie[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

  useEffect(() => {
    loadActors();
  }, []);

  const loadActors = async () => {
    setIsLoading(true);
    try {
      const response = await actorAPI.getAllActors();
      setActors(response.data.actors || response.data || []);
    } catch (error) {
      console.error('Failed to load actors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await actorAPI.updateActor(editingId, formData);
      } else {
        await actorAPI.createActor(formData);
      }
      loadActors();
      setShowForm(false);
      setFormData({
        name: '',
        introduction: '',
        imageUrl: '',
      });
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save actor:', error);
    }
  };

  const handleDelete = async (actorId: number | string) => {
    if (confirm('Are you sure you want to delete this actor?')) {
      try {
        await actorAPI.deleteActor(actorId);
        loadActors();
      } catch (error) {
        console.error('Failed to delete actor:', error);
      }
    }
  };

  // Handle click on actor card to show detail modal
  const handleActorClick = async (actor: IActor) => {
    setSelectedActor(actor);
    setIsLoadingMovies(true);
    try {
      const response = await movieActorAPI.getMoviesOfActor(actor.id);
      setActorMovies(response.data || []);
    } catch (error) {
      console.error('Failed to load actor movies:', error);
      setActorMovies([]);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  // Close actor detail modal
  const closeActorModal = () => {
    setSelectedActor(null);
    setActorMovies([]);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-400">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">Manage Actors</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search actors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:border-yellow-500"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'none')}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-500"
          >
            <option value="none">Sort by</option>
            <option value="asc">Name A-Z</option>
            <option value="desc">Name Z-A</option>
          </select>
          {!showForm && (
            <Button
              variant="primary"
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({ name: '', introduction: '', imageUrl: '' });
              }}
            >
              <Plus size={20} className="mr-2" />
              Add Actor
            </Button>
          )}
        </div>
      </div>

      {/* Modal Popup for Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl mx-4">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Edit Actor' : 'Add New Actor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Actor Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">
                  Introduction
                </label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded h-32 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <Input
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
              />

              <div className="flex gap-3">
                <Button variant="primary" type="submit">
                  {editingId ? 'Update' : 'Create'} Actor
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Actors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actors
          .filter((actor) => actor.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .sort((a, b) => {
            if (sortOrder === 'asc') return a.name.localeCompare(b.name);
            if (sortOrder === 'desc') return b.name.localeCompare(a.name);
            return 0;
          })
          .map((actor) => (
            <div
              key={actor.id}
              className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-yellow-500 transition-colors cursor-pointer"
              onClick={() => handleActorClick(actor)}
            >
              <div className="h-64 bg-gray-800 overflow-hidden">
                {actor.imageUrl ? (
                  <img
                    src={actor.imageUrl}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">{actor.name}</h3>
                {actor.introduction && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {actor.introduction}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(actor.id as any);
                      setShowForm(true);
                      setFormData({
                        name: actor.name,
                        introduction: actor.introduction || '',
                        imageUrl: actor.imageUrl || '',
                      });
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(actor.id);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {actors.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No actors found. Create your first actor!
        </div>
      )}

      {/* Actor Detail Modal */}
      {selectedActor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeActorModal}
          />

          {/* Modal Content */}
          <div className="relative bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl mx-4">
            {/* Close Button */}
            <button
              onClick={closeActorModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Actor Info Section */}
            <div className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-700">
              {/* Actor Image */}
              <div className="w-full md:w-48 h-64 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                {selectedActor.imageUrl ? (
                  <img
                    src={selectedActor.imageUrl}
                    alt={selectedActor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Film size={48} />
                  </div>
                )}
              </div>

              {/* Actor Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">
                  {selectedActor.name}
                </h2>
                {selectedActor.introduction ? (
                  <p className="text-gray-300 leading-relaxed">
                    {selectedActor.introduction}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">Chưa có thông tin giới thiệu</p>
                )}
              </div>
            </div>

            {/* Movies Section */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Film size={20} />
                Phim đã tham gia
              </h3>

              {isLoadingMovies ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-400">Đang tải danh sách phim...</div>
                </div>
              ) : actorMovies.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  Diễn viên chưa tham gia phim nào
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {actorMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-yellow-500 hover:scale-105 transition-all cursor-pointer"
                    >
                      {/* Movie Poster */}
                      <div className="h-36 bg-gray-700 overflow-hidden">
                        {movie.imageUrl ? (
                          <img
                            src={movie.imageUrl}
                            alt={movie.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <Film size={32} />
                          </div>
                        )}
                      </div>

                      {/* Movie Info */}
                      <div className="p-3">
                        <h4 className="text-white text-sm font-semibold line-clamp-2 mb-2">
                          {movie.name}
                        </h4>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          <Star size={14} fill="currentColor" />
                          <span>{movie.averageScore?.toFixed(1) || '0.0'}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
