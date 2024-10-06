// src/App.tsx
import MemeEditor from '@/components/MemeEditor';
import MemeTemplate from '@/components/MemeTemplate';
import TemplateUploader from '@/components/MemeTemplateUploader';
import React, { useState } from 'react';

const MemeEditPage: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [memeTemplates, setMemeTemplates] = useState([
        { src: '/assets/cat.jpg', name: 'cat' },
        { src: '/assets/drake.jpg', name: 'drake' },
    ]);

    const handleUpload = (newTemplate: string) => {
        setMemeTemplates([
            ...memeTemplates,
            { src: newTemplate, name: `custom-${Date.now()}` },
        ]);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-4">
                Meme Generator
            </h1>
            {!selectedTemplate ? (
                <>
                    <TemplateUploader onUpload={handleUpload} />
                    <div className="flex justify-center flex-wrap">
                        {memeTemplates.map((template) => (
                            <MemeTemplate
                                key={template.name}
                                image={template.src}
                                onSelect={setSelectedTemplate}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <MemeEditor template={selectedTemplate} />
            )}
        </div>
    );
};

export default MemeEditPage;
