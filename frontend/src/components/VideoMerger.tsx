// src/components/VideoMerger.tsx
import React, { useState } from 'react';
import httpRequest from '../http'; // Assuming httpRequest is correctly implemented for Axios or fetch

const VideoMerger: React.FC = () => {
    const [videoUrls, setVideoUrls] = useState<string[]>(['']); // State to hold video URLs
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddVideo = () => {
        setVideoUrls((prevUrls) => [...prevUrls, '']);
    };

    const handleVideoUrlChange = (index: number, value: string) => {
        const newVideoUrls = [...videoUrls];
        newVideoUrls[index] = value;
        setVideoUrls(newVideoUrls);
    };

    const handleMergeVideos = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await httpRequest.post('/merge-videos', {
                urls: videoUrls,
            });
            const downloadUrl = window.URL.createObjectURL(
                new Blob([response.data]),
            );
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'merged_video.mp4');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError(
                'Error merging videos. Please check the URLs and try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[500px] mx-auto p-4 border border-gray-300 rounded shadow bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Merge Videos
            </h2>
            {videoUrls.map((url, index) => (
                <div key={index} className="mb-4">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) =>
                            handleVideoUrlChange(index, e.target.value)
                        }
                        placeholder={`Enter Video URL ${index + 1}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded
                        focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
            ))}
            <button
                onClick={handleAddVideo}
                className="block w-full py-2 mt-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Add Video
            </button>
            <button
                onClick={handleMergeVideos}
                disabled={loading}
                className={`block w-full py-2 mt-4 ${
                    loading
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded-lg`}
            >
                {loading ? 'Merging...' : 'Merge Videos'}
            </button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
    );
};

export default VideoMerger;
