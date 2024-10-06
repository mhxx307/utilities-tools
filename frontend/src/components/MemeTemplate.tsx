// src/components/MemeTemplate.tsx
import React from 'react';

interface MemeTemplateProps {
    image: string;
    onSelect: (image: string) => void;
}

const MemeTemplate: React.FC<MemeTemplateProps> = ({ image, onSelect }) => {
    return (
        <div className="m-2 cursor-pointer" onClick={() => onSelect(image)}>
            <img
                src={image}
                alt="meme template"
                className="w-48 h-auto rounded-lg shadow-lg"
            />
        </div>
    );
};

export default MemeTemplate;
