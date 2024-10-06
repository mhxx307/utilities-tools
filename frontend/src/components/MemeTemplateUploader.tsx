// src/components/TemplateUploader.tsx
import React from 'react';

interface TemplateUploaderProps {
    onUpload: (image: string) => void;
}

const TemplateUploader: React.FC<TemplateUploaderProps> = ({ onUpload }) => {
    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newTemplate = e.target?.result as string;
                onUpload(newTemplate);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mb-4">
            <input
                type="file"
                accept="image/*,image/gif"
                onChange={handleUpload}
                className="p-2 border rounded"
            />
        </div>
    );
};

export default TemplateUploader;
