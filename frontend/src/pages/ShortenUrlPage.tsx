import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShortenUrlPage: React.FC = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [password, setPassword] = useState('');
    const [maxClicks, setMaxClicks] = useState<number | undefined>(undefined);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setShortUrl('');

        try {
            const response = await axios.post(
                'https://spoo.me/',
                {
                    url: originalUrl,
                    alias: alias || undefined,
                    password: password || undefined,
                    'max-clicks': maxClicks || undefined,
                },
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        Accept: 'application/json',
                    },
                },
            );

            setShortUrl(response.data.short_url);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(JSON.stringify(error.response.data));
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">URL Shortener</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center w-full max-w-md"
            >
                <input
                    type="text"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="p-2 border border-gray-300 rounded mb-4 w-full"
                />
                <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="Custom Alias (optional)"
                    className="p-2 border border-gray-300 rounded mb-4 w-full"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (optional)"
                    className="p-2 border border-gray-300 rounded mb-4 w-full"
                />
                <input
                    type="number"
                    value={maxClicks || ''}
                    onChange={(e) =>
                        setMaxClicks(parseInt(e.target.value) || undefined)
                    }
                    placeholder="Max Clicks (optional)"
                    className="p-2 border border-gray-300 rounded mb-4 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    Shorten
                </button>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {shortUrl && (
                <div className="mt-8">
                    <p className="text-lg">Shortened URL:</p>
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {shortUrl}
                    </a>
                    <p className="mt-2">
                        Short Code: {extractShortCode(shortUrl)}
                    </p>
                </div>
            )}

            <Link to="/statistics" className="mt-8 text-blue-500 underline">
                View URL Statistics
            </Link>
        </div>
    );
};

export default ShortenUrlPage;

// Function to extract the short code from the shortened URL
const extractShortCode = (shortUrl: string): string => {
    const parts = shortUrl.split('/');
    return parts[parts.length - 1];
};
