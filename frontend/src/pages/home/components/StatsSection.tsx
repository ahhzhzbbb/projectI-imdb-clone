import React from 'react';

interface IStatItem {
    value: string | number;
    label: string;
    color: 'yellow' | 'blue' | 'green' | 'purple';
}

interface IStatsSectionProps {
    /** Stats items to display */
    stats: IStatItem[];
}

/**
 * StatsSection component - Quick stats grid
 */
export const StatsSection: React.FC<IStatsSectionProps> = ({ stats }) => {
    const colorClasses = {
        yellow: 'border-yellow-500/20 text-yellow-500',
        blue: 'border-blue-500/20 text-blue-500',
        green: 'border-green-500/20 text-green-500',
        purple: 'border-purple-500/20 text-purple-500',
    };

    return (
        <div className="grid grid-cols-4 gap-3 mb-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`bg-zinc-900 border ${colorClasses[stat.color].split(' ')[0]} rounded-lg py-3 px-4 text-center`}
                >
                    <div className={`text-xl font-bold ${colorClasses[stat.color].split(' ')[1]}`}>
                        {stat.value}
                    </div>
                    <div className="text-gray-400 text-xs">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};
