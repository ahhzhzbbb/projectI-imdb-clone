import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import type { IMovie, IGenre, IDirector } from '../../types';
import { movieAPI, genreAPI, directorAPI } from '../../api';
import { Edit2, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Admin Movies Management
 */
export const AdminMoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    movieName: '',
    description: '',
    imageUrl: '',
    trailerUrl: '',
    tvSeries: false,
    directorId: '' as string | number,
  });
  const [selectedGenreIds, setSelectedGenreIds] = useState<Array<number | string>>([]);
  const [originalGenreIds, setOriginalGenreIds] = useState<Array<number | string>>([]);
  const [movieGenres, setMovieGenres] = useState<IGenre[]>([]);
  const [directors, setDirectors] = useState<IDirector[]>([]);
  const [directorSearch, setDirectorSearch] = useState('');
  const [selectedDirectorName, setSelectedDirectorName] = useState('');
  const [showDirectorDropdown, setShowDirectorDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

  useEffect(() => {
    loadMovies();
    loadDirectors();
  }, []);

  const loadDirectors = async () => {
    try {
      const response = await directorAPI.getAllDirectors();
      const directorsData = response.data.directors || response.data || [];
      setDirectors(Array.isArray(directorsData) ? directorsData : []);
    } catch (error) {
      console.error('Failed to load directors:', error);
    }
  };


  const loadMovies = async () => {
    setIsLoading(true);
    try {
      const response = await movieAPI.getAllMovies();
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };



  const handleEditClick = async (movieId: number | string) => {
    try {
      // Get full movie details and genres in parallel
      const [detailResponse, genresResponse] = await Promise.all([
        movieAPI.getMovieDetail(movieId),
        genreAPI.getGenresOfMovie(movieId),
      ]);

      // Handle different response formats
      const movieDetail = detailResponse.data.data || detailResponse.data;
      const genres = genresResponse.data || [];
      console.log('Loaded movie detail for editing:', movieDetail);
      console.log('Loaded movie genres:', genres);

      if (!movieDetail) {
        throw new Error('No movie data received');
      }

      setEditingId(movieId as any);
      setFormData({
        movieName: movieDetail.name,
        description: movieDetail.description || '',
        imageUrl: movieDetail.imageUrl || '',
        trailerUrl: movieDetail.trailerUrl || '',
        tvSeries: movieDetail.tvSeries || false,
        directorId: movieDetail.director?.id || '',
      });
      // Set director name for searchable input
      setSelectedDirectorName(movieDetail.director?.name || '');
      setDirectorSearch('');
      const existingGenreIds = genres.map((g: any) => g.id);
      setSelectedGenreIds(existingGenreIds);
      setOriginalGenreIds(existingGenreIds);
      setMovieGenres(genres);
      setShowForm(true);
    } catch (error: any) {
      console.error('Failed to load movie details:', error);
      alert('Failed to load movie details: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movieRequest = {
        movieName: formData.movieName,
        description: formData.description,
        imageUrl: formData.imageUrl,
        trailerUrl: formData.trailerUrl,
        tvSeries: formData.tvSeries,
        directorId: formData.directorId ? Number(formData.directorId) : null,
      };

      let resultingMovieId: number | string | null = null;
      if (editingId) {
        // Update existing movie
        console.log('Updating movie:', editingId, movieRequest);
        await movieAPI.updateMovie(editingId, movieRequest);
        resultingMovieId = editingId;
        console.log('Movie updated successfully');
      } else {
        // Create new movie
        console.log('Creating movie with payload:', movieRequest);
        const response = await movieAPI.createMovie(movieRequest);
        const created = response.data;
        resultingMovieId = created?.id || null;
        console.log('Movie created successfully:', response.data);
      }

      // Sync genres (add/remove)
      if (resultingMovieId != null) {
        const toAdd = selectedGenreIds.filter((id) => !originalGenreIds.includes(id));
        const toRemove = originalGenreIds.filter((id) => !selectedGenreIds.includes(id));

        await Promise.all([
          ...toAdd.map((gid) => genreAPI.addGenreToMovie(resultingMovieId as any, gid)),
          ...toRemove.map((gid) => genreAPI.removeGenreFromMovie(resultingMovieId as any, gid)),
        ]).catch((err) => console.error('Failed to sync genres:', err));
      }

      loadMovies();
      setShowForm(false);
      setFormData({
        movieName: '',
        description: '',
        imageUrl: '',
        trailerUrl: '',
        tvSeries: false,
        directorId: '',
      });
      setSelectedGenreIds([]);
      setOriginalGenreIds([]);
      setSelectedDirectorName('');
      setDirectorSearch('');
      setEditingId(null);
    } catch (error: any) {
      console.error('Failed to save movie:', error);
      alert(`Error: ${error.response?.data?.message || error.message || 'Failed to save movie'}`);
    }
  };

  const handleDelete = async (movieId: number | string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieAPI.deleteMovie(movieId);
        loadMovies();
      } catch (error) {
        console.error('Failed to delete movie:', error);
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
        <h1 className="text-3xl font-black text-white">Manage Movies</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search movies..."
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
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  movieName: '',
                  description: '',
                  imageUrl: '',
                  trailerUrl: '',
                  tvSeries: false,
                  directorId: '',
                });
                setSelectedGenreIds([]);
                setOriginalGenreIds([]);
                setSelectedDirectorName('');
                setDirectorSearch('');
              }}
            >
              <Plus size={20} className="mr-2" />
              Add Movie
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
          <div className="relative bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl mx-4">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Edit Movie' : 'Add New Movie'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Movie Name"
                name="movieName"
                value={formData.movieName}
                onChange={handleInputChange}
                required
              />

              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
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

              <Input
                label="Trailer URL"
                name="trailerUrl"
                value={formData.trailerUrl}
                onChange={handleInputChange}
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="tvSeries"
                  id="tvSeries"
                  checked={formData.tvSeries}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="tvSeries" className="text-gray-300">
                  This is a TV Series
                </label>
              </div>

              {/* Director searchable input */}
              <div className="relative">
                <label className="text-sm font-semibold text-gray-300 block mb-2">
                  Director
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search director..."
                    value={directorSearch || selectedDirectorName}
                    onChange={(e) => {
                      setDirectorSearch(e.target.value);
                      setShowDirectorDropdown(true);
                      // Clear selection if user types
                      if (formData.directorId) {
                        setFormData(prev => ({ ...prev, directorId: '' }));
                        setSelectedDirectorName('');
                      }
                    }}
                    onFocus={() => setShowDirectorDropdown(true)}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:border-yellow-500"
                  />
                  {formData.directorId && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, directorId: '' }));
                        setSelectedDirectorName('');
                        setDirectorSearch('');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {showDirectorDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-48 overflow-y-auto shadow-xl">
                    {directors
                      .filter(d => d.name.toLowerCase().includes((directorSearch || '').toLowerCase()))
                      .slice(0, 10)
                      .map((director) => (
                        <div
                          key={director.id}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, directorId: director.id }));
                            setSelectedDirectorName(director.name);
                            setDirectorSearch('');
                            setShowDirectorDropdown(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-white"
                        >
                          {director.name}
                        </div>
                      ))}
                    {directors.filter(d => d.name.toLowerCase().includes((directorSearch || '').toLowerCase())).length === 0 && (
                      <div className="px-3 py-2 text-gray-500">No directors found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Genres list (only show in Edit mode) */}
              {editingId && (
                <div>
                  <label className="text-sm font-semibold text-gray-300 block mb-2">
                    Genres
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-700 rounded bg-gray-800 min-h-[48px]">
                    {movieGenres.length === 0 ? (
                      <span className="text-gray-500 text-sm">No genres assigned</span>
                    ) : (
                      movieGenres.map((g) => (
                        <span
                          key={g.id}
                          title={g.description || `Genre: ${g.name || g.genreName}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 cursor-help hover:bg-yellow-500/30 transition-colors"
                        >
                          {g.name || g.genreName}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 items-center">
                <Button variant="primary" type="submit">
                  {editingId ? 'Update' : 'Create'} Movie
                </Button>

                {editingId && (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate(`/admin/movie-genres?movieId=${editingId}`)}
                  >
                    Manage Genres
                  </Button>
                )}

                {editingId && (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate(`/admin/movie-actors?movieId=${editingId}`)}
                  >
                    Manage Actors
                  </Button>
                )}

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


      {/* Movies Table */}
      <div className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="text-left p-4 text-white font-semibold">Name</th>
              <th className="text-left p-4 text-white font-semibold">Type</th>
              <th className="text-left p-4 text-white font-semibold">Score</th>
              <th className="text-left p-4 text-white font-semibold">Reviews</th>
              <th className="text-center p-4 text-white font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {movies
              .filter((movie) => movie.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .sort((a, b) => {
                if (sortOrder === 'asc') return a.name.localeCompare(b.name);
                if (sortOrder === 'desc') return b.name.localeCompare(a.name);
                return 0;
              })
              .map((movie) => (
                <tr key={movie.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-4 text-white">{movie.name}</td>
                  <td className="p-4">
                    {movie.tvSeries ? (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        TV Series
                      </span>
                    ) : (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Movie
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-yellow-500 font-semibold">
                    {movie.averageScore.toFixed(1)}/10
                  </td>
                  <td className="p-4 text-gray-400">{movie.reviewCount}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleEditClick(movie.id)}
                      className="text-blue-500 hover:text-blue-600 mr-3 inline-block"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="text-red-500 hover:text-red-600 inline-block"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {movies.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No movies found. Create your first movie!
          </div>
        )}
      </div>
    </MainLayout>
  );
};
