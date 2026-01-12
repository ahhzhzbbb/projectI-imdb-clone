import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';
import type { IMovie, IGenre } from '../../types';
import { movieAPI, genreAPI } from '../../api';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';

/**
 * Admin: assign/unassign genres to a movie
 */
export const AdminMovieGenresPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [allGenres, setAllGenres] = useState<IGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [movieQuery, setMovieQuery] = useState('');
  const [genreQuery, setGenreQuery] = useState('');

  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [selectedGenreIds, setSelectedGenreIds] = useState<Array<number | string>>([]);
  const [originalGenreIds, setOriginalGenreIds] = useState<Array<number | string>>([]);

  useEffect(() => {
    loadData();
  }, []);

  // If movieId is provided via query param, auto-select it after data load
  const location = useLocation();
  const movieIdParam = useMemo(() => new URLSearchParams(location.search).get('movieId'), [location.search]);
  const simpleMode = Boolean(movieIdParam);

  useEffect(() => {
    if (!movieIdParam) return;
    const id = movieIdParam;
    // Fetch movie genres using the correct API endpoint
    const fetchMovieGenres = async () => {
      try {
        // Get movie name from movies list if available
        const movie = movies.find((m) => String(m.id) === String(id));
        if (movie) {
          setSelectedMovie(movie);
        } else {
          setSelectedMovie({ id: Number(id), name: `Movie #${id}` } as IMovie);
        }

        // Fetch genres attached to this movie using correct API
        const genresRes = await genreAPI.getGenresOfMovie(id);
        const movieGenres = genresRes.data || [];
        const ids = Array.isArray(movieGenres) ? movieGenres.map((g: any) => g.id) : [];
        setSelectedGenreIds(ids);
        setOriginalGenreIds(ids);
      } catch (err) {
        console.error('Failed to load movie genres:', err);
        setSelectedGenreIds([]);
        setOriginalGenreIds([]);
      }
    };
    fetchMovieGenres();
  }, [movieIdParam, movies]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [mRes, gRes] = await Promise.all([movieAPI.getAllMovies(), genreAPI.getAllGenres()]);
      const moviesData = mRes.data.movies || mRes.data || [];
      const genresData = gRes.data.genres || gRes.data || [];
      setMovies(Array.isArray(moviesData) ? moviesData : []);
      setAllGenres(Array.isArray(genresData) ? genresData : []);
    } catch (err) {
      console.error('Failed to load movies or genres:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const movieOptions = useMemo(() => {
    const q = movieQuery.trim().toLowerCase();
    return q ? movies.filter((m) => m.name.toLowerCase().includes(q)) : movies;
  }, [movies, movieQuery]);

  const filteredGenres = useMemo(() => {
    const q = genreQuery.trim().toLowerCase();
    return q ? allGenres.filter((g) => (g.name || g.genreName || '').toLowerCase().includes(q)) : allGenres;
  }, [allGenres, genreQuery]);

  const onSelectMovie = async (movie: IMovie) => {
    setSelectedMovie(movie);
    // load movie details to get genres
    try {
      const res = await movieAPI.getMovieDetail(movie.id as any);
      const detail = res.data.data || res.data || {};
      const ids = (detail.genres || []).map((g: any) => g.id);
      setSelectedGenreIds(ids);
      setOriginalGenreIds(ids);
    } catch (err) {
      console.error('Failed to load movie detail:', err);
      setSelectedGenreIds([]);
      setOriginalGenreIds([]);
    }
  };

  const toggleGenre = (genreId: number | string) => {
    setSelectedGenreIds((prev) => (prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]));
  };

  const saveChanges = async () => {
    if (!selectedMovie) return alert('Please choose a movie first');
    const movieId = selectedMovie.id as any;
    const toAdd = selectedGenreIds.filter((id) => !originalGenreIds.includes(id));
    const toRemove = originalGenreIds.filter((id) => !selectedGenreIds.includes(id));

    try {
      await Promise.all([
        ...toAdd.map((gid) => genreAPI.addGenreToMovie(movieId, gid)),
        ...toRemove.map((gid) => genreAPI.removeGenreFromMovie(movieId, gid)),
      ]);
      alert('Genres updated');
      setOriginalGenreIds([...selectedGenreIds]);
    } catch (err) {
      console.error('Failed to sync genres:', err);
      alert('Failed to save changes');
    }
  };

  const clearSelection = () => {
    setSelectedMovie(null);
    setSelectedGenreIds([]);
    setOriginalGenreIds([]);
    setMovieQuery('');
  };

  const addGenreImmediate = async (genreId: number | string) => {
    if (!selectedMovie) return alert('Select a movie first');
    try {
      await genreAPI.addGenreToMovie(selectedMovie.id as any, genreId);
      setSelectedGenreIds((s) => Array.from(new Set([...s, genreId])));
      setOriginalGenreIds((s) => Array.from(new Set([...s, genreId])));
    } catch (err) {
      console.error('Failed to add genre:', err);
      alert('Failed to add genre');
    }
  };

  const removeGenreImmediate = async (genreId: number | string) => {
    if (!selectedMovie) return alert('Select a movie first');
    try {
      await genreAPI.removeGenreFromMovie(selectedMovie.id as any, genreId);
      setSelectedGenreIds((s) => s.filter((id) => id !== genreId));
      setOriginalGenreIds((s) => s.filter((id) => id !== genreId));
    } catch (err) {
      console.error('Failed to remove genre:', err);
      alert('Failed to remove genre');
    }
  };

  // Render
  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-gray-400">Loading...</div>
      </MainLayout>
    );
  }

  // If the page was opened with ?movieId=..., render simplified view: list of genres with Add/Remove buttons
  if (simpleMode) {
    return (
      <MainLayout>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => window.history.back()}>
              ← Back
            </Button>
            <h1 className="text-3xl font-black text-white">Manage Genres for {selectedMovie ? selectedMovie.name : `Movie #${movieIdParam}`}</h1>
          </div>
        </div>

        {/* Current attached genres summary */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Attached Genres ({selectedGenreIds.length}):</h3>
          {selectedGenreIds.length === 0 ? (
            <span className="text-gray-500">No genres attached</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allGenres.filter((g) => selectedGenreIds.includes(g.id)).map((g) => (
                <span key={g.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-900/50 text-yellow-300 border border-yellow-600">
                  ✓ {g.name || g.genreName}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* All genres with Add/Remove toggle */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">All Genres</h2>
            <input
              type="text"
              placeholder="Search genres..."
              value={genreQuery}
              onChange={(e) => setGenreQuery(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredGenres.map((g) => {
              const isAttached = selectedGenreIds.includes(g.id);
              return (
                <div
                  key={g.id}
                  className={`p-3 rounded border-2 flex items-center justify-between transition-all ${isAttached
                    ? 'bg-yellow-900/40 border-yellow-500'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                >
                  <div className="flex-1">
                    <div className={`font-semibold ${isAttached ? 'text-yellow-300' : 'text-white'}`}>
                      {isAttached && '✓ '}{g.name || g.genreName}
                    </div>
                    {g.description && <div className="text-gray-400 text-sm">{g.description}</div>}
                  </div>
                  <div className="ml-2">
                    {isAttached ? (
                      <Button variant="danger" onClick={() => removeGenreImmediate(g.id)}>
                        Remove
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={() => addGenreImmediate(g.id)}>
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredGenres.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No genres found matching "{genreQuery}"
              </div>
            )}
          </div>
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

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Assign Genres to Movie</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Movie selector */}
        <div className="md:col-span-1 bg-gray-900 border border-gray-700 rounded-lg p-4">
          <label className="text-sm text-gray-300 font-semibold block mb-2">Search Movie</label>
          <div className="flex items-center gap-2 mb-3">
            <input
              value={movieQuery}
              onChange={(e) => setMovieQuery(e.target.value)}
              placeholder="Type movie name..."
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white"
            />
            <Button variant="secondary" onClick={() => setMovieQuery('')}>Clear</Button>
          </div>

          <div className="max-h-72 overflow-auto">
            {movieOptions.length === 0 && <div className="text-gray-400">No movies</div>}
            {movieOptions.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMovie(m)}
                className={`p-2 rounded cursor-pointer ${selectedMovie?.id === m.id ? 'bg-yellow-500 text-black' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                {m.name}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="secondary" onClick={clearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>

        {/* Middle: Genres list + filter */}
        <div className="md:col-span-2 bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <SearchIcon className="text-gray-400" />
              <input
                value={genreQuery}
                onChange={(e) => setGenreQuery(e.target.value)}
                placeholder="Filter genres..."
                className="bg-gray-800 border border-gray-700 px-3 py-2 rounded text-white w-72"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="primary" onClick={saveChanges}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => { setSelectedGenreIds([...originalGenreIds]); }}>
                Reset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-auto p-2">
            {filteredGenres.map((g) => (
              <label key={g.id} className="flex items-center gap-2 bg-gray-800 p-2 rounded border border-gray-700">
                <input
                  type="checkbox"
                  checked={selectedGenreIds.includes(g.id)}
                  onChange={() => toggleGenre(g.id)}
                />
                <div>
                  <div className="text-white font-semibold">{g.name || g.genreName}</div>
                  {g.description && <div className="text-gray-400 text-sm">{g.description}</div>}
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-400">Select a movie on the left, then check/uncheck genres and press Save Changes.</div>
        </div>
      </div>
    </MainLayout>
  );
};
