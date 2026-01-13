import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../store/AuthContext';
import apiClient from '../api/axiosConfig';
import { User, ArrowLeft, Edit3, Save, X } from 'lucide-react';

interface UserProfile {
    userId: number;
    username: string;
    phoneNumber: string;
    roles: string[];
}

/**
 * Profile Page - View and edit user profile
 */
export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        phoneNumber: '',
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadProfile();
    }, [isAuthenticated]);

    const loadProfile = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<UserProfile>('/auth/user');
            setProfile(response.data);
            setFormData({
                phoneNumber: response.data.phoneNumber || '',
            });
        } catch (err: any) {
            console.error('Failed to load profile:', err);
            setError('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await apiClient.put<UserProfile>('/auth/user', {
                phoneNumber: formData.phoneNumber,
            });
            setProfile(response.data);
            setIsEditing(false);
        } catch (err: any) {
            console.error('Failed to update profile:', err);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            phoneNumber: profile?.phoneNumber || '',
        });
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-pulse text-gray-400 text-xl">Loading...</div>
                </div>
            </MainLayout>
        );
    }

    if (error || !profile) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center h-96">
                    <p className="text-red-500 text-xl mb-4">{error || 'Profile not found'}</p>
                    <Button onClick={() => navigate('/')}>Go Home</Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Profile Header */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-6">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <User size={48} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                            <p className="text-gray-400">
                                {profile.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'Member'}
                            </p>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                            <h2 className="text-xl font-bold text-white">Profile Information</h2>
                            {!isEditing ? (
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit3 size={16} className="mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                        <Save size={16} className="mr-2" />
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                    >
                                        <X size={16} className="mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Username - Read Only */}
                        <div>
                            <label className="text-sm font-semibold text-gray-400 block mb-2">
                                Username
                            </label>
                            <div className="bg-gray-800 border border-gray-700 text-gray-400 px-4 py-3 rounded-lg">
                                {profile.username}
                            </div>
                            <p className="text-gray-500 text-xs mt-1">Username cannot be changed</p>
                        </div>

                        {/* Phone Number - Editable */}
                        <div>
                            <label className="text-sm font-semibold text-gray-400 block mb-2">
                                Phone Number
                            </label>
                            {isEditing ? (
                                <Input
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                />
                            ) : (
                                <div className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg">
                                    {profile.phoneNumber || 'Not provided'}
                                </div>
                            )}
                        </div>

                        {/* Role - Read Only */}
                        <div>
                            <label className="text-sm font-semibold text-gray-400 block mb-2">
                                Role
                            </label>
                            <div className="flex gap-2">
                                {profile.roles?.map((role, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${role === 'ROLE_ADMIN'
                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                            }`}
                                    >
                                        {role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
