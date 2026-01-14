import React from 'react';
import { Input } from '../../../../components/common/Input';
import { Button } from '../../../../components/common/Button';
import type { IGenre, IDirector } from '../../../../types';

interface IMovieFormData {
    movieName: string;
    description: string;
    imageUrl: string;
    trailerUrl: string;
    tvSeries: boolean;
    directorId: string | number;
}

interface IMovieFormProps {
    /** Form data */
    formData: IMovieFormData;
    /** Whether editing existing movie */
    isEditing: boolean;
    /** Directors list */
    directors: IDirector[];
    /** Director search term */
    directorSearch: string;
    /** Selected director name */
    selectedDirectorName: string;
    /** Whether to show director dropdown */
    showDirectorDropdown: boolean;
    /** Movie genres (for edit mode) */
    movieGenres?: IGenre[];
    /** Editing movie ID (for navigation) */
    editingId?: number | null;
    /** Callbacks */
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onDirectorSearchChange: (search: string) => void;
    onDirectorSelect: (director: IDirector) => void;
    onClearDirector: () => void;
    onShowDirectorDropdown: (show: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onNavigateGenres?: () => void;
    onNavigateActors?: () => void;
}

/**
 * MovieForm component - Form for creating/editing movies
 */
export const MovieForm: React.FC<IMovieFormProps> = ({
    formData,
    isEditing,
    directors,
    directorSearch,
    selectedDirectorName,
    showDirectorDropdown,
    movieGenres = [],
    editingId,
    onInputChange,
    onDirectorSearchChange,
    onDirectorSelect,
    onClearDirector,
    onShowDirectorDropdown,
    onSubmit,
    onCancel,
    onNavigateGenres,
    onNavigateActors,
}) => {
    const filteredDirectors = directors.filter(d =>
        d.name.toLowerCase().includes((directorSearch || '').toLowerCase())
    ).slice(0, 10);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Input
                label="Movie Name"
                name="movieName"
                value={formData.movieName}
                onChange={onInputChange}
                required
            />

            <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded h-32 focus:outline-none focus:border-yellow-500"
                />
            </div>

            <Input
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={onInputChange}
            />

            <Input
                label="Trailer URL"
                name="trailerUrl"
                value={formData.trailerUrl}
                onChange={onInputChange}
            />

            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="tvSeries"
                    id="tvSeries"
                    checked={formData.tvSeries}
                    onChange={onInputChange}
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
                        onChange={(e) => onDirectorSearchChange(e.target.value)}
                        onFocus={() => onShowDirectorDropdown(true)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:border-yellow-500"
                    />
                    {formData.directorId && (
                        <button
                            type="button"
                            onClick={onClearDirector}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {showDirectorDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-48 overflow-y-auto shadow-xl">
                        {filteredDirectors.map((director) => (
                            <div
                                key={director.id}
                                onClick={() => onDirectorSelect(director)}
                                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-white"
                            >
                                {director.name}
                            </div>
                        ))}
                        {filteredDirectors.length === 0 && (
                            <div className="px-3 py-2 text-gray-500">No directors found</div>
                        )}
                    </div>
                )}
            </div>

            {/* Genres list (only show in Edit mode) */}
            {isEditing && editingId && (
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

            {/* Action buttons */}
            <div className="flex gap-3 items-center">
                <Button variant="primary" type="submit">
                    {isEditing ? 'Update' : 'Create'} Movie
                </Button>

                {isEditing && onNavigateGenres && (
                    <Button variant="secondary" type="button" onClick={onNavigateGenres}>
                        Manage Genres
                    </Button>
                )}

                {isEditing && onNavigateActors && (
                    <Button variant="secondary" type="button" onClick={onNavigateActors}>
                        Manage Actors
                    </Button>
                )}

                <Button variant="secondary" type="button" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};
