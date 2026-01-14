import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { Button, Modal, SearchAndFilter, DataTable, LoadingSpinner } from '../../../components/common';
import type { IColumn } from '../../../components/common/DataTable';
import { MovieForm } from './components/MovieForm';
import type { IMovie, IGenre, IDirector } from '../../../types';
import { movieAPI, genreAPI, directorAPI } from '../../../api';

/**
 * Admin Movies Management - Refactored version
 */
export const AdminMoviesPage: React.FC = () => {
    const navigate = useNavigate();

    // Data state
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [directors, setDirectors] = useState<IDirector[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form state
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
    const [directorSearch, setDirectorSearch] = useState('');
    const [selectedDirectorName, setSelectedDirectorName] = useState('');
    const [showDirectorDropdown, setShowDirectorDropdown] = useState(false);

    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<string>('none');

    // Load data on mount
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

    // Filter and sort movies
    const filteredMovies = useMemo(() => {
        let result = movies.filter((movie) =>
            movie.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortOrder === 'asc') {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'desc') {
            result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        }

        return result;
    }, [movies, searchTerm, sortOrder]);

    // Form handlers
    const resetForm = () => {
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
        setMovieGenres([]);
        setSelectedDirectorName('');
        setDirectorSearch('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target as any;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleEditClick = async (movie: IMovie) => {
        try {
            const [detailResponse, genresResponse] = await Promise.all([
                movieAPI.getMovieDetail(movie.id),
                genreAPI.getGenresOfMovie(movie.id),
            ]);

            const movieDetail = detailResponse.data.data || detailResponse.data;
            const genres = genresResponse.data || [];

            if (!movieDetail) {
                throw new Error('No movie data received');
            }

            setEditingId(movie.id as number);
            setFormData({
                movieName: movieDetail.name,
                description: movieDetail.description || '',
                imageUrl: movieDetail.imageUrl || '',
                trailerUrl: movieDetail.trailerUrl || '',
                tvSeries: movieDetail.tvSeries || false,
                directorId: movieDetail.director?.id || '',
            });
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
                await movieAPI.updateMovie(editingId, movieRequest);
                resultingMovieId = editingId;
            } else {
                const response = await movieAPI.createMovie(movieRequest);
                resultingMovieId = response.data?.id || null;
            }

            // Sync genres
            if (resultingMovieId != null) {
                const toAdd = selectedGenreIds.filter((id) => !originalGenreIds.includes(id));
                const toRemove = originalGenreIds.filter((id) => !selectedGenreIds.includes(id));

                await Promise.all([
                    ...toAdd.map((gid) => genreAPI.addGenreToMovie(resultingMovieId as any, gid)),
                    ...toRemove.map((gid) => genreAPI.removeGenreFromMovie(resultingMovieId as any, gid)),
                ]).catch((err) => console.error('Failed to sync genres:', err));
            }

            loadMovies();
            resetForm();
        } catch (error: any) {
            console.error('Failed to save movie:', error);
            alert(`Error: ${error.response?.data?.message || error.message || 'Failed to save movie'}`);
        }
    };

    const handleDelete = async (movie: IMovie) => {
        if (confirm('Are you sure you want to delete this movie?')) {
            try {
                await movieAPI.deleteMovie(movie.id);
                loadMovies();
            } catch (error) {
                console.error('Failed to delete movie:', error);
            }
        }
    };

    const handleDirectorSelect = (director: IDirector) => {
        setFormData((prev) => ({ ...prev, directorId: director.id }));
        setSelectedDirectorName(director.name);
        setDirectorSearch('');
        setShowDirectorDropdown(false);
    };

    const handleClearDirector = () => {
        setFormData((prev) => ({ ...prev, directorId: '' }));
        setSelectedDirectorName('');
        setDirectorSearch('');
    };

    const handleDirectorSearchChange = (search: string) => {
        setDirectorSearch(search);
        setShowDirectorDropdown(true);
        if (formData.directorId) {
            setFormData((prev) => ({ ...prev, directorId: '' }));
            setSelectedDirectorName('');
        }
    };

    // Table columns
    const columns: IColumn<IMovie>[] = [
        { header: 'Name', accessor: 'name' },
        {
            header: 'Type',
            accessor: (movie) => (
                movie.tvSeries ? (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">TV Series</span>
                ) : (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Movie</span>
                )
            ),
        },
        {
            header: 'Score',
            accessor: (movie) => (
                <span className="text-yellow-500 font-semibold">{movie.averageScore.toFixed(1)}/10</span>
            ),
        },
        {
            header: 'Reviews',
            accessor: (movie) => <span className="text-gray-400">{movie.reviewCount}</span>,
        },
    ];

    if (isLoading) {
        return (
            <AdminLayout title="Manage Movies">
                <LoadingSpinner fullHeight message="Loading movies..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Manage Movies"
            headerActions={
                <>
                    <SearchAndFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search movies..."
                        sortValue={sortOrder}
                        sortOptions={[
                            { value: 'none', label: 'Sort by' },
                            { value: 'asc', label: 'Name A-Z' },
                            { value: 'desc', label: 'Name Z-A' },
                        ]}
                        onSortChange={setSortOrder}
                    />
                    <Button variant="primary" onClick={() => { resetForm(); setShowForm(true); }}>
                        <Plus size={20} className="mr-2" />
                        Add Movie
                    </Button>
                </>
            }
        >
            {/* Movie Form Modal */}
            <Modal
                isOpen={showForm}
                onClose={resetForm}
                title={editingId ? 'Edit Movie' : 'Add New Movie'}
                size="lg"
            >
                <MovieForm
                    formData={formData}
                    isEditing={!!editingId}
                    directors={directors}
                    directorSearch={directorSearch}
                    selectedDirectorName={selectedDirectorName}
                    showDirectorDropdown={showDirectorDropdown}
                    movieGenres={movieGenres}
                    editingId={editingId}
                    onInputChange={handleInputChange}
                    onDirectorSearchChange={handleDirectorSearchChange}
                    onDirectorSelect={handleDirectorSelect}
                    onClearDirector={handleClearDirector}
                    onShowDirectorDropdown={setShowDirectorDropdown}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                    onNavigateGenres={() => navigate(`/admin/movie-genres?movieId=${editingId}`)}
                    onNavigateActors={() => navigate(`/admin/movie-actors?movieId=${editingId}`)}
                />
            </Modal>

            {/* Movies Table */}
            <DataTable
                columns={columns}
                data={filteredMovies}
                getRowKey={(movie) => movie.id as number}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                emptyMessage="No movies found. Create your first movie!"
            />
        </AdminLayout>
    );
};
