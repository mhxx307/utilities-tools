// UrlStatistics.tsx

import React, { useState } from 'react';
import axios from 'axios';

interface UrlStatisticsProps {
    shortCode: string;
}

const UrlStatistics: React.FC<UrlStatisticsProps> = () => {
    const [shortCode, setShortCode] = useState('');
    const [statistics, setStatistics] = useState<any | null>(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const fetchStatistics = async () => {
        setError('');
        try {
            const response = await axios.post(
                `https://spoo.me/stats/${shortCode}`,
                {
                    password: password || undefined,
                },
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            setStatistics(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(
                    'Failed to fetch statistics. ' + error.response.data.error,
                );
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    const exportData = async (exportFormat: string) => {
        try {
            const response = await axios.post(
                `https://spoo.me/export/${shortCode}/${exportFormat}`,
                {
                    password: password || undefined,
                },
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    responseType: 'blob', // Set the response type to blob for file download
                },
            );

            // Create a URL object from the blob response
            const url = window.URL.createObjectURL(new Blob([response.data]));
            // Create a temporary <a> element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `statistics.${exportFormat}`);
            // Append the link to the body and trigger the download
            document.body.appendChild(link);
            link.click();
            // Clean up: remove the temporary link
            document.body.removeChild(link);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError('Failed to export data. ' + error.response.data.error);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="bg-white shadow-md rounded p-4 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">URL Statistics</h2>
            <div className="mb-4">
                <label
                    htmlFor="short-code"
                    className="block text-sm font-medium text-gray-700"
                >
                    Short Code
                </label>
                <input
                    id="short-code"
                    type="text"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password (if required)
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
            </div>
            <button
                onClick={fetchStatistics}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Fetch Statistics
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {statistics && (
                <div className="mt-4">
                    <p>
                        <strong>Short Code:</strong> {statistics._id}
                    </p>
                    <p>
                        <strong>Original URL:</strong>{' '}
                        <a
                            href={statistics.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {statistics.url}
                        </a>
                    </p>
                    <p>
                        <strong>Total Clicks:</strong> {statistics.total_clicks}
                    </p>
                    <p>
                        <strong>Total Unique Clicks:</strong>{' '}
                        {statistics.total_unique_clicks}
                    </p>
                    <p>
                        <strong>Average Daily Clicks:</strong>{' '}
                        {statistics.average_daily_clicks}
                    </p>
                    <p>
                        <strong>Average Weekly Clicks:</strong>{' '}
                        {statistics.average_weekly_clicks}
                    </p>
                    <p>
                        <strong>Average Monthly Clicks:</strong>{' '}
                        {statistics.average_monthly_clicks}
                    </p>
                    <p>
                        <strong>Creation Date:</strong>{' '}
                        {statistics['creation-date']}
                    </p>
                    <p>
                        <strong>Last Click:</strong> {statistics['last-click']}
                    </p>
                    {/* Add more statistics as needed */}
                </div>
            )}

            <div className="mt-4 grid gap-4 grid-cols-2">
                <button
                    onClick={() => exportData('json')}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Export as JSON
                </button>
                <button
                    onClick={() => exportData('csv')}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Export as CSV
                </button>
                <button
                    onClick={() => exportData('xlsx')}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Export as XLSX
                </button>
                <button
                    onClick={() => exportData('xml')}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Export as XML
                </button>
            </div>
        </div>
    );
};

export default UrlStatistics;
