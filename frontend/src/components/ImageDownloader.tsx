// src/components/ImageDownloader.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageDownloader: React.FC = () => {
    const [images, setImages] = useState<any[]>([]);
    const [filteredImages, setFilteredImages] = useState<any[]>([]);
    const [size, setSize] = useState('original'); // Default size changed to 'original'
    const [tags, setTags] = useState<any[]>([]); // State to hold tags fetched from API
    const [selectedTags, setSelectedTags] = useState<number[]>([]); // State to hold selected tag IDs
    const [loading, setLoading] = useState(false); // Loading state for fetch operations

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true); // Set loading state to true
                // Check if images are cached
                const cachedImages = localStorage.getItem('cachedImages');
                if (cachedImages) {
                    setImages(JSON.parse(cachedImages));
                    setFilteredImages(JSON.parse(cachedImages)); // Initialize filteredImages with cached images
                } else {
                    const response = await axios.get(
                        'https://api.nekosapi.com/v3/images',
                    );
                    setImages(response.data.items);
                    setFilteredImages(response.data.items);
                    localStorage.setItem(
                        'cachedImages',
                        JSON.stringify(response.data.items),
                    ); // Cache images in localStorage
                }
            } catch (err) {
                console.error('Error fetching images:', err);
            } finally {
                setLoading(false); // Set loading state to false after fetch completes
            }
        };

        const fetchTags = async () => {
            try {
                // Check if tags are cached
                const cachedTags = localStorage.getItem('cachedTags');
                if (cachedTags) {
                    setTags(JSON.parse(cachedTags));
                } else {
                    const response = await axios.get(
                        'https://api.nekosapi.com/v3/images/tags',
                    );
                    setTags(response.data.items);
                    localStorage.setItem(
                        'cachedTags',
                        JSON.stringify(response.data.items),
                    ); // Cache tags in localStorage
                }
            } catch (err) {
                console.error('Error fetching tags:', err);
            }
        };

        fetchImages();
        fetchTags();
    }, []); // Fetch images and tags only once on component mount

    const handleRandomImages = async () => {
        try {
            setLoading(true); // Set loading state to true
            const response = await axios.get(
                'https://api.nekosapi.com/v3/images/random',
            );
            setImages(response.data.items);
            setFilteredImages(response.data.items);
            localStorage.setItem(
                'cachedImages',
                JSON.stringify(response.data.items),
            ); // Cache new random images in localStorage
        } catch (err) {
            console.error('Error fetching random images:', err);
        } finally {
            setLoading(false); // Set loading state to false after fetch completes
        }
    };

    const handleFilterByTag = (tagId: number) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter((id) => id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }
    };

    useEffect(() => {
        if (selectedTags.length === 0) {
            setFilteredImages(images);
        } else {
            const filtered = images.filter((image) =>
                image.tags.some((tag: any) => selectedTags.includes(tag.id)),
            );
            setFilteredImages(filtered);
        }
    }, [selectedTags, images]);

    const handleDownload = async (url: string) => {
        // Create an anchor element
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
    };

    return (
        <div className="max-w-800px mx-auto p-4 border border-gray-300 rounded shadow bg-white text-center">
            <h2 className="text-2xl font-bold mb-4">Download Images</h2>
            <div className="flex justify-center gap-4 mb-4">
                {/* Size options can be adjusted based on API response */}
                <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded"
                >
                    <option value="original">Original</option>
                    <option value="sample">Sample</option>
                </select>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {tags.map((tag: any) => (
                    <button
                        key={tag.id}
                        onClick={() => handleFilterByTag(tag.id)}
                        className={`px-3 py-1 rounded-lg ${
                            selectedTags.includes(tag.id)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                        } hover:bg-blue-600 hover:text-white`}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
            <button
                onClick={handleRandomImages}
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Random Images'}
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((image: any) => (
                    <div
                        key={image.id}
                        className="relative border border-gray-300 rounded overflow-hidden"
                    >
                        <img
                            src={
                                size === 'original'
                                    ? image.image_url
                                    : image.sample_url
                            }
                            alt=""
                            className="w-full h-auto"
                        />
                        <button
                            onClick={() =>
                                handleDownload(
                                    size === 'original'
                                        ? image.image_url
                                        : image.sample_url,
                                )
                            }
                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg"
                        >
                            Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageDownloader;
