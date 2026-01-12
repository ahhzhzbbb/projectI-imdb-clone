import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import type { IDirector } from '../../types';
import { directorAPI } from '../../api';
import { Edit2, Trash2, Plus, ArrowLeft } from 'lucide-react';

/**
 * Admin Directors Management
 */
export const AdminDirectorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [directors, setDirectors] = useState<IDirector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    introduction: '',
    imageUrl: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDirectors();
  }, []);

  const loadDirectors = async () => {
    setIsLoading(true);
    try {
      const response = await directorAPI.getAllDirectors();
      // Backend returns { directors: [...] } format
      setDirectors(response.data.directors || response.data || []);
    } catch (error) {
      console.error('Failed to load directors:', error);
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
        await directorAPI.updateDirector(editingId, formData);
      } else {
        await directorAPI.createDirector(formData);
      }
      loadDirectors();
      setShowForm(false);
      setFormData({
        name: '',
        introduction: '',
        imageUrl: '',
      });
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save director:', error);
    }
  };

  const handleDelete = async (directorId: number | string) => {
    if (confirm('Are you sure you want to delete this director?')) {
      try {
        await directorAPI.deleteDirector(directorId);
        loadDirectors();
      } catch (error) {
        console.error('Failed to delete director:', error);
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
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">Manage Directors</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search directors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:border-yellow-500"
          />
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
              Add Director
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
              {editingId ? 'Edit Director' : 'Add New Director'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Director Name"
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
                  {editingId ? 'Update' : 'Create'} Director
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

      {/* Directors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {directors
          .filter((director) => director.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((director) => (
            <div
              key={director.id}
              className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-yellow-500 transition-colors"
            >
              <div className="h-64 bg-gray-800 overflow-hidden">
                {director.imageUrl ? (
                  <img
                    src={director.imageUrl}
                    alt={director.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">{director.name}</h3>
                {director.introduction && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {director.introduction}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(director.id as any);
                      setShowForm(true);
                      setFormData({
                        name: director.name,
                        introduction: director.introduction || '',
                        imageUrl: director.imageUrl || '',
                      });
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(director.id)}
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

      {directors.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No directors found. Create your first director!
        </div>
      )}
    </MainLayout>
  );
};
