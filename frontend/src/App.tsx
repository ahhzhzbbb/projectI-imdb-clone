import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { WishlistPage } from './pages/WishlistPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { ActorDetailPage } from './pages/ActorDetailPage';
import { SearchPage } from './pages/SearchPage';
import { GenreDetailPage } from './pages/GenreDetailPage';
import { GenresPage } from './pages/GenresPage';
import { EpisodeDetailPage } from './pages/EpisodeDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMoviesPage } from './pages/admin/movies/AdminMoviesPage';
import { AdminActorsPage } from './pages/admin/AdminActorsPage';
import { AdminDirectorsPage } from './pages/admin/AdminDirectorsPage';
import { AdminGenresPage } from './pages/admin/AdminGenresPage';
import { AdminMovieGenresPage } from './pages/admin/AdminMovieGenresPage';
import { AdminMovieActorsPage } from './pages/admin/AdminMovieActorsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminEpisodesPage } from './pages/admin/AdminEpisodesPage';
import './styles/globals.css';

// Protected Route Component
interface IProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role?.roleName !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { getCurrentUser } = useAuth();

  // Load user khi app mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      getCurrentUser();
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/movie/:movieId" element={<MovieDetailPage />} />
        <Route path="/actor/:actorId" element={<ActorDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/genre/:genreId" element={<GenreDetailPage />} />
        <Route path="/episode/:episodeId" element={<EpisodeDetailPage />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminMoviesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/actors"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminActorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/directors"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDirectorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/genres"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminGenresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movie-genres"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminMovieGenresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movie-actors"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminMovieActorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/episodes"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminEpisodesPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
