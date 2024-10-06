// src/components/MemeEditor.tsx
import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import useUndo from 'use-undo';

interface MemeEditorProps {
    template: string;
}

interface TextBox {
    id: number;
    text: string;
    color: string;
    bgColor: string;
    fontSize: number;
    position: { x: number; y: number };
}

const MemeEditor: React.FC<MemeEditorProps> = ({ template }) => {
    const [textBoxes, setTextBoxes] = useUndo<TextBox[]>([]);
    const [selectedTextBox, setSelectedTextBox] = useState<number | null>(null);
    const memeRef = useRef<HTMLDivElement>(null);

    const addTextBox = () => {
        const newTextBox: TextBox = {
            id: Date.now(),
            text: 'New Text',
            color: '#FFFFFF',
            bgColor: 'transparent',
            fontSize: 32,
            position: { x: 100, y: -50 },
        };
        setTextBoxes.set([...textBoxes.present, newTextBox]);
        setSelectedTextBox(newTextBox.id);
    };

    const updateTextBox = (
        id: number,
        key: keyof TextBox,
        value: string | number | { x: number; y: number },
    ) => {
        setTextBoxes.set(
            textBoxes.present.map((box) =>
                box.id === id ? { ...box, [key]: value } : box,
            ),
        );
    };

    const handleTextBoxClick = (id: number) => {
        setSelectedTextBox(id);
    };

    const handleClickOutside = (e: React.MouseEvent) => {
        if (memeRef.current && !memeRef.current.contains(e.target as Node)) {
            setSelectedTextBox(null);
        }
    };

    const deleteTextBox = () => {
        if (selectedTextBox !== null) {
            setTextBoxes.set(
                textBoxes.present.filter((box) => box.id !== selectedTextBox),
            );
            setSelectedTextBox(null);
        }
    };

    const downloadMeme = () => {
        const node = document.getElementById('meme')!;
        toPng(node)
            .then((dataUrl) => {
                saveAs(dataUrl, 'meme.png');
            })
            .catch((err) => {
                console.error('Failed to download image:', err);
            });
    };

    return (
        <div className="text-center" onClick={handleClickOutside}>
            <div
                id="meme"
                ref={memeRef}
                className="relative inline-block w-96 h-auto rounded-lg shadow-lg"
                // style={{
                //     backgroundImage: `url(${template})`,
                //     backgroundSize: 'cover',
                //     backgroundPosition: 'center',
                // }}
            >
                <img
                    src={template}
                    alt="selected meme"
                    className="w-96 h-auto rounded-lg shadow-lg"
                />
                {textBoxes.present.map((box) => (
                    <Draggable
                        key={box.id}
                        bounds="parent"
                        position={box.position}
                        onStop={(_, data) =>
                            updateTextBox(box.id, 'position', {
                                x: data.x,
                                y: data.y,
                            })
                        }
                    >
                        <div
                            className={`absolute cursor-move text-2xl font-bold drop-shadow-md ${
                                selectedTextBox === box.id
                                    ? 'border-2 border-dashed border-black'
                                    : ''
                            }`}
                            style={{
                                color: box.color,
                                fontSize: `${box.fontSize}px`,
                                backgroundColor: box.bgColor,
                            }}
                            onClick={() => handleTextBoxClick(box.id)}
                        >
                            {box.text}
                        </div>
                    </Draggable>
                ))}
            </div>
            <div className="mt-4">
                <button
                    onClick={addTextBox}
                    className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-700"
                >
                    Add Text
                </button>
                {selectedTextBox !== null && (
                    <div className="flex items-center justify-center">
                        <input
                            type="text"
                            value={
                                textBoxes.present.find(
                                    (box) => box.id === selectedTextBox,
                                )?.text || ''
                            }
                            onChange={(e) =>
                                updateTextBox(
                                    selectedTextBox,
                                    'text',
                                    e.target.value,
                                )
                            }
                            className="mb-2 p-2 border rounded"
                        />
                        <input
                            type="color"
                            value={
                                textBoxes.present.find(
                                    (box) => box.id === selectedTextBox,
                                )?.color || '#FFFFFF'
                            }
                            onChange={(e) =>
                                updateTextBox(
                                    selectedTextBox,
                                    'color',
                                    e.target.value,
                                )
                            }
                            className="mb-2 p-2 border rounded"
                        />
                        <input
                            type="color"
                            value={
                                textBoxes.present.find(
                                    (box) => box.id === selectedTextBox,
                                )?.bgColor || 'transparent'
                            }
                            onChange={(e) =>
                                updateTextBox(
                                    selectedTextBox,
                                    'bgColor',
                                    e.target.value,
                                )
                            }
                            className="mb-2 p-2 border rounded"
                        />
                        <input
                            type="number"
                            value={
                                textBoxes.present.find(
                                    (box) => box.id === selectedTextBox,
                                )?.fontSize || 32
                            }
                            onChange={(e) =>
                                updateTextBox(
                                    selectedTextBox,
                                    'fontSize',
                                    Number(e.target.value),
                                )
                            }
                            className="mb-2 p-2 border rounded"
                            min="10"
                            max="72"
                        />
                        <button
                            onClick={deleteTextBox}
                            className="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                )}
                <div className="flex justify-center mt-2 space-x-2">
                    <button
                        onClick={() => setTextBoxes.undo()}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                    >
                        Undo
                    </button>
                    <button
                        onClick={() => setTextBoxes.redo()}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                    >
                        Redo
                    </button>
                </div>
                <button
                    onClick={downloadMeme}
                    className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    Download Meme
                </button>
            </div>
        </div>
    );
};

export default MemeEditor;
