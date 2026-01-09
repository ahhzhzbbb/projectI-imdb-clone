import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import type { IGenre } from '../../types';
import { genreAPI } from '../../api';
import { Edit2, Trash2, Plus } from 'lucide-react';

/**
 * Admin Genres Management
 */
export const AdminGenresPage: React.FC = () => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setIsLoading(true);
    try {
      const response = await genreAPI.getAllGenres();
      console.log('Genres response:', response.data);
      const genresData = response.data.genres || response.data || [];
      console.log('Processed genres:', genresData);
      setGenres(genresData);
    } catch (error) {
      console.error('Failed to load genres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      const genreRequest = {
        name: formData.name,
        description: formData.description,
      };

      if (editingId) {
        // Backend không hỗ trợ update, chỉ có delete + create
        alert('Update feature not supported. Please delete and create a new genre.');
      } else {
        // Create new genre
        console.log('Creating genre with payload:', genreRequest);
        const response = await genreAPI.createGenre(genreRequest);
        console.log('Genre created successfully:', response.data);
        loadGenres();
      }

      setShowForm(false);
      setFormData({
        name: '',
        description: '',
      });
      setEditingId(null);
    } catch (error: any) {
      console.error('Failed to save genre:', error);
      alert(
        `Error: ${error.response?.data?.message || error.message || 'Failed to save genre'}`
      );
    }
  };

  const handleDelete = async (genreId: number | string) => {
    if (confirm('Are you sure you want to delete this genre?')) {
      try {
        await genreAPI.deleteGenre(genreId);
        loadGenres();
      } catch (error) {
        console.error('Failed to delete genre:', error);
      }
    }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">Manage Genres</h1>
        {!showForm ? (
          <Button
            variant="primary"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
              });
            }}
          >
            <Plus size={20} className="mr-2" />
            Add Genre
          </Button>
        ) : null}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Edit Genre' : 'Add New Genre'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Genre Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter genre description..."
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded h-24 focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="primary" type="submit">
                {editingId ? 'Update' : 'Create'} Genre
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
      )}

      {/* Genres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
          >
                <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-bold text-lg">
                {genre.name || genre.genreName}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(genre.id as any);
                    setShowForm(true);
                    setFormData({
                      name: genre.name || genre.genreName || '',
                      description: genre.description || '',
                    });
                  }}
                  className="text-blue-500 hover:text-blue-600 p-1"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(genre.id)}
                  className="text-red-500 hover:text-red-600 p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            {/* Description */}
            {genre.description && (
              <p className="text-gray-400 text-sm mt-2">{genre.description}</p>
            )}
          </div>
        ))}
      </div>

      {genres.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No genres found. Create your first genre!
        </div>
      )}
    </MainLayout>
  );
};
