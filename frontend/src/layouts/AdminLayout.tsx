import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';

interface IAdminLayoutProps {
    /** Page title */
    title: string;
    /** Back button destination (default: /admin) */
    backTo?: string;
    /** Header actions (buttons, etc.) */
    headerActions?: React.ReactNode;
    /** Page content */
    children: React.ReactNode;
}

/**
 * AdminLayout component - Shared layout for admin pages
 */
export const AdminLayout: React.FC<IAdminLayoutProps> = ({
    title,
    backTo = '/admin',
    headerActions,
    children,
}) => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            {/* Back Button */}
            <button
                onClick={() => navigate(backTo)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
            </button>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white">{title}</h1>
                {headerActions && <div className="flex items-center gap-4">{headerActions}</div>}
            </div>

            {/* Content */}
            {children}
        </MainLayout>
    );
};
