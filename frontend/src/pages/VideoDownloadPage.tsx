import VideoDownloader from '@/components/VideoDownloader';
import VideoMerger from '@/components/VideoMerger';
import React from 'react';

const VideoDownloadPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <VideoDownloader />
            <VideoMerger />
        </div>
    );
};

export default VideoDownloadPage;
