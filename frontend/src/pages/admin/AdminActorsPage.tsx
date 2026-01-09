import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import type { IActor } from '../../types';
import { actorAPI } from '../../api';
import { Edit2, Trash2, Plus } from 'lucide-react';

/**
 * Admin Actors Management
 */
export const AdminActorsPage: React.FC = () => {
  const [actors, setActors] = useState<IActor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    introduction: '',
    imageUrl: '',
  });

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
        <h1 className="text-3xl font-black text-white">Manage Actors</h1>
        <Button
          variant="primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
        >
          <Plus size={20} className="mr-2" />
          Add Actor
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
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
      )}

      {/* Actors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actors.map((actor) => (
          <div
            key={actor.id}
            className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-yellow-500 transition-colors"
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
                  onClick={() => {
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
                  onClick={() => handleDelete(actor.id)}
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
    </MainLayout>
  );
};
