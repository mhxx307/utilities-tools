// src/components/VideoDownloader.tsx
import React, { useState } from 'react';
import httpRequest from '../http';

const VideoDownloader: React.FC = () => {
    const [url, setUrl] = useState('');
    const [filename, setFilename] = useState('download.mp4');
    const [fileType, setFileType] = useState<'video' | 'audio'>('video');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFileType = e.target.value as 'video' | 'audio';
        setFileType(newFileType);
        const newExtension = newFileType === 'video' ? 'mp4' : 'mp3';
        setFilename((prevFilename) => {
            const nameWithoutExtension = prevFilename
                .split('.')
                .slice(0, -1)
                .join('.');
            return `${nameWithoutExtension}.${newExtension}`;
        });
    };

    const handleDownload = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await httpRequest.post(
                '/download',
                { url, fileType },
                { responseType: 'blob' },
            );
            const downloadUrl = window.URL.createObjectURL(
                new Blob([response.data]),
            );
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError(
                'Error downloading the file. Please check the URL and try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[500px] mx-auto p-4 border border-gray-300 rounded shadow bg-white space-y-4">
            <h2 className="text-xl font-bold mb-4">
                Download YouTube Video/Audio
            </h2>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube URL"
                className="w-full px-3 py-2 border border-gray-300 rounded
                        focus:outline-none focus:ring focus:ring-blue-500 "
            />
            <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                className="w-full px-3 py-2 border border-gray-300 rounded
                        focus:outline-none focus:ring focus:ring-blue-500"
            />
            <select
                value={fileType}
                onChange={handleFileTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
            >
                <option value="video">Video</option>
                <option value="audio">Audio</option>
            </select>
            <button
                onClick={handleDownload}
                className="btn-download bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
                disabled={loading}
            >
                {loading ? 'Downloading...' : 'Download'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default VideoDownloader;
