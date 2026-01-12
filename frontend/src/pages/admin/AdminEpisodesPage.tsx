import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { movieAPI, seasonAPI, episodeAPI } from '../../api';
import type { IMovie, ISeason, IEpisode } from '../../types';
import { Plus, Trash2, Edit2, ArrowLeft, Film, Tv } from 'lucide-react';

interface IEpisodeFormData {
    episodeNumber: number;
    title: string;
    summary: string;
    posterURL: string;
    trailerURL: string;
}

/**
 * Admin Episodes Management Page
 * Access via /admin/episodes?movieId=X for managing episodes of a specific movie
 */
export const AdminEpisodesPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const movieIdParam = useMemo(() => new URLSearchParams(location.search).get('movieId'), [location.search]);

    const [movies, setMovies] = useState<IMovie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
    const [seasons, setSeasons] = useState<ISeason[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState<number | string | null>(null);
    const [episodes, setEpisodes] = useState<IEpisode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

    // Episode form state
    const [showForm, setShowForm] = useState(false);
    const [editingEpisodeId, setEditingEpisodeId] = useState<number | string | null>(null);
    const [formData, setFormData] = useState<IEpisodeFormData>({
        episodeNumber: 1,
        title: '',
        summary: '',
        posterURL: '',
        trailerURL: '',
    });

    const [movieQuery, setMovieQuery] = useState('');

    useEffect(() => {
        loadMovies();
    }, []);

    // Auto-select movie if movieId is provided
    useEffect(() => {
        if (movieIdParam && movies.length > 0) {
            const movie = movies.find((m) => String(m.id) === movieIdParam);
            if (movie && movie.tvSeries) {
                setSelectedMovie(movie);
                loadMovieSeasons(movie.id);
            }
        }
    }, [movieIdParam, movies]);

    const loadMovies = async () => {
        setIsLoading(true);
        try {
            const response = await movieAPI.getAllMovies();
            const moviesData = response.data.movies || response.data || [];
            // Only show TV Series (movies with tvSeries = true)
            const tvSeriesList = Array.isArray(moviesData) ? moviesData.filter((m: IMovie) => m.tvSeries) : [];
            setMovies(tvSeriesList);
        } catch (error) {
            console.error('Failed to load movies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMovieSeasons = async (movieId: number | string) => {
        try {
            const response = await movieAPI.getMovieDetail(movieId);
            const movieDetail = response.data.data || response.data;
            if (movieDetail && movieDetail.seasons) {
                setSeasons(movieDetail.seasons);
                // Auto-select first season if available
                if (movieDetail.seasons.length > 0) {
                    const firstSeason = movieDetail.seasons[0];
                    setSelectedSeasonId(firstSeason.id);
                    loadSeasonEpisodes(firstSeason.id);
                } else {
                    setEpisodes([]);
                }
            }
        } catch (error) {
            console.error('Failed to load movie seasons:', error);
            setSeasons([]);
            setEpisodes([]);
        }
    };

    const loadSeasonEpisodes = async (seasonId: number | string) => {
        setIsLoadingEpisodes(true);
        try {
            const response = await seasonAPI.getSeasonDetail(seasonId);
            const seasonDetail = response.data;
            setEpisodes(seasonDetail.episodes || []);
        } catch (error) {
            console.error('Failed to load episodes:', error);
            setEpisodes([]);
        } finally {
            setIsLoadingEpisodes(false);
        }
    };

    const handleSelectMovie = (movie: IMovie) => {
        setSelectedMovie(movie);
        setSelectedSeasonId(null);
        setEpisodes([]);
        loadMovieSeasons(movie.id);
    };

    const handleSelectSeason = (seasonId: number | string) => {
        setSelectedSeasonId(seasonId);
        loadSeasonEpisodes(seasonId);
    };

    const handleAddSeason = async () => {
        if (!selectedMovie) return;
        try {
            await seasonAPI.addSeason(selectedMovie.id);
            loadMovieSeasons(selectedMovie.id);
        } catch (error) {
            console.error('Failed to add season:', error);
            alert('Failed to add season');
        }
    };

    const handleDeleteLastSeason = async () => {
        if (!selectedMovie) return;
        if (!confirm('Are you sure you want to delete the last season? All episodes in it will be deleted.')) return;
        try {
            await seasonAPI.deleteLastSeason(selectedMovie.id);
            loadMovieSeasons(selectedMovie.id);
        } catch (error) {
            console.error('Failed to delete season:', error);
            alert('Failed to delete season');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitEpisode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSeasonId) return alert('Please select a season first');

        try {
            if (editingEpisodeId) {
                await episodeAPI.updateEpisode(editingEpisodeId, formData);
            } else {
                await episodeAPI.createEpisode(selectedSeasonId, formData);
            }
            loadSeasonEpisodes(selectedSeasonId);
            setShowForm(false);
            setEditingEpisodeId(null);
            setFormData({ episodeNumber: 1, title: '', summary: '', posterURL: '', trailerURL: '' });
        } catch (error) {
            console.error('Failed to save episode:', error);
            alert('Failed to save episode');
        }
    };

    const handleEditEpisode = (episode: IEpisode) => {
        setEditingEpisodeId(episode.id);
        setFormData({
            episodeNumber: episode.episodeNumber,
            title: episode.title,
            summary: episode.summary || '',
            posterURL: episode.posterURL || '',
            trailerURL: episode.trailerURL || '',
        });
        setShowForm(true);
    };

    const handleDeleteEpisode = async (episodeId: number | string) => {
        if (!confirm('Are you sure you want to delete this episode?')) return;
        try {
            await episodeAPI.deleteEpisode(episodeId);
            if (selectedSeasonId) loadSeasonEpisodes(selectedSeasonId);
        } catch (error) {
            console.error('Failed to delete episode:', error);
            alert('Failed to delete episode');
        }
    };

    const filteredMovies = useMemo(() => {
        const q = movieQuery.trim().toLowerCase();
        return q ? movies.filter((m) => m.name.toLowerCase().includes(q)) : movies;
    }, [movies, movieQuery]);

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

            <div className="mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Tv className="text-yellow-500" />
                    Manage Episodes
                </h1>
                <p className="text-gray-400 mt-2">Select a TV Series to manage its seasons and episodes</p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left: TV Series Selector */}
                <div className="col-span-12 md:col-span-3">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <h2 className="text-lg font-bold text-white mb-4">TV Series</h2>
                        <input
                            type="text"
                            placeholder="Search TV series..."
                            value={movieQuery}
                            onChange={(e) => setMovieQuery(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded mb-4 focus:outline-none focus:border-yellow-500"
                        />
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredMovies.length === 0 && (
                                <div className="text-gray-500 text-center py-4">No TV series found</div>
                            )}
                            {filteredMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    onClick={() => handleSelectMovie(movie)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedMovie?.id === movie.id
                                        ? 'bg-yellow-500 text-black'
                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="font-semibold truncate">{movie.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle: Seasons */}
                <div className="col-span-12 md:col-span-2">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">Seasons</h2>
                        </div>

                        {selectedMovie ? (
                            <>
                                <div className="space-y-2 mb-4">
                                    {seasons.length === 0 && (
                                        <div className="text-gray-500 text-center py-4">No seasons</div>
                                    )}
                                    {seasons.map((season) => (
                                        <button
                                            key={season.id}
                                            onClick={() => handleSelectSeason(season.id)}
                                            className={`w-full p-3 rounded-lg font-semibold transition-colors ${selectedSeasonId === season.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-800 text-white hover:bg-gray-700'
                                                }`}
                                        >
                                            Season {season.number}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="primary" onClick={handleAddSeason} className="flex-1">
                                        <Plus size={16} />
                                    </Button>
                                    <Button variant="danger" onClick={handleDeleteLastSeason} className="flex-1" disabled={seasons.length === 0}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-500 text-center py-8">Select a TV Series first</div>
                        )}
                    </div>
                </div>

                {/* Right: Episodes */}
                <div className="col-span-12 md:col-span-7">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">
                                Episodes {selectedSeasonId && `(Season ${seasons.find(s => s.id === selectedSeasonId)?.number || ''})`}
                            </h2>
                            {selectedSeasonId && (
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setShowForm(true);
                                        setEditingEpisodeId(null);
                                        // Auto-calculate next episode number
                                        const nextEpisodeNumber = episodes.length > 0
                                            ? Math.max(...episodes.map(e => e.episodeNumber)) + 1
                                            : 1;
                                        setFormData({ episodeNumber: nextEpisodeNumber, title: '', summary: '', posterURL: '', trailerURL: '' });
                                    }}
                                >
                                    <Plus size={18} className="mr-2" />
                                    Add Episode
                                </Button>
                            )}
                        </div>

                        {/* Episode Form Modal */}
                        {showForm && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div
                                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                                    onClick={() => setShowForm(false)}
                                />
                                <div className="relative bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl mx-4">
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl"
                                    >
                                        ✕
                                    </button>
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        {editingEpisodeId ? 'Edit Episode' : 'Add New Episode'}
                                    </h3>
                                    <form onSubmit={handleSubmitEpisode} className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-300 block mb-2">
                                                Episode Number
                                            </label>
                                            <input
                                                type="number"
                                                name="episodeNumber"
                                                value={formData.episodeNumber}
                                                onChange={(e) => setFormData(prev => ({ ...prev, episodeNumber: parseInt(e.target.value) || 1 }))}
                                                min={1}
                                                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:border-yellow-500"
                                                required
                                            />
                                        </div>
                                        <Input
                                            label="Episode Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <div>
                                            <label className="text-sm font-semibold text-gray-300 block mb-2">
                                                Summary
                                            </label>
                                            <textarea
                                                name="summary"
                                                value={formData.summary}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded h-24 focus:outline-none focus:border-yellow-500"
                                                placeholder="Episode summary..."
                                            />
                                        </div>
                                        <Input
                                            label="Poster URL"
                                            name="posterURL"
                                            value={formData.posterURL}
                                            onChange={handleInputChange}
                                        />
                                        <Input
                                            label="Trailer URL"
                                            name="trailerURL"
                                            value={formData.trailerURL}
                                            onChange={handleInputChange}
                                        />
                                        <div className="flex gap-3">
                                            <Button variant="primary" type="submit">
                                                {editingEpisodeId ? 'Update' : 'Create'} Episode
                                            </Button>
                                            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Episodes List */}
                        {!selectedSeasonId ? (
                            <div className="text-gray-500 text-center py-12">
                                <Film size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Select a season to view episodes</p>
                            </div>
                        ) : isLoadingEpisodes ? (
                            <div className="text-gray-400 text-center py-12">Loading episodes...</div>
                        ) : episodes.length === 0 ? (
                            <div className="text-gray-500 text-center py-12">
                                <Film size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No episodes in this season</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {episodes.map((episode) => (
                                    <div
                                        key={episode.id}
                                        className="flex gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                                    >
                                        <div className="w-24 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                                            {episode.posterURL ? (
                                                <img src={episode.posterURL} alt={episode.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <Film size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-semibold">
                                                E{episode.episodeNumber} · {episode.title}
                                            </h4>
                                            {episode.summary && (
                                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{episode.summary}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span>⭐ {(episode.averageScore ?? 0).toFixed(1)}/10</span>
                                                <span>{episode.reviewCount ?? 0} ratings</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditEpisode(episode)}
                                                className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEpisode(episode.id)}
                                                className="p-2 text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
