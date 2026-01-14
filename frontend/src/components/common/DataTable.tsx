import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export interface IColumn<T> {
    /** Column header */
    header: string;
    /** Key to access data or custom render function */
    accessor: keyof T | ((item: T) => React.ReactNode);
    /** Column width class */
    className?: string;
}

interface IDataTableProps<T> {
    /** Table columns configuration */
    columns: IColumn<T>[];
    /** Data rows */
    data: T[];
    /** Get unique key for each row */
    getRowKey: (item: T) => string | number;
    /** Show edit button */
    showEdit?: boolean;
    /** Show delete button */
    showDelete?: boolean;
    /** Callback when edit is clicked */
    onEdit?: (item: T) => void;
    /** Callback when delete is clicked */
    onDelete?: (item: T) => void;
    /** Empty state message */
    emptyMessage?: string;
}

/**
 * DataTable component - Reusable table for admin pages
 */
export function DataTable<T>({
    columns,
    data,
    getRowKey,
    showEdit = true,
    showDelete = true,
    onEdit,
    onDelete,
    emptyMessage = 'No data found',
}: IDataTableProps<T>) {
    const renderCell = (item: T, accessor: IColumn<T>['accessor']) => {
        if (typeof accessor === 'function') {
            return accessor(item);
        }
        return String(item[accessor] ?? '');
    };

    return (
        <div className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-lg">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-700 bg-gray-800">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={`text-left p-4 text-white font-semibold ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                        {(showEdit || showDelete) && (
                            <th className="text-center p-4 text-white font-semibold">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={getRowKey(item)}
                            className="border-b border-gray-700 hover:bg-gray-800"
                        >
                            {columns.map((col, idx) => (
                                <td key={idx} className={`p-4 text-white ${col.className || ''}`}>
                                    {renderCell(item, col.accessor)}
                                </td>
                            ))}
                            {(showEdit || showDelete) && (
                                <td className="p-4 text-center">
                                    {showEdit && onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-blue-500 hover:text-blue-600 mr-3 inline-block"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                    )}
                                    {showDelete && onDelete && (
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="text-red-500 hover:text-red-600 inline-block"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {data.length === 0 && (
                <div className="text-center text-gray-400 py-8">{emptyMessage}</div>
            )}
        </div>
    );
}
