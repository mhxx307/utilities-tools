// src/layouts/MainLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Header />
            <div className="flex flex-grow items-center justify-center w-full">
                {children}
            </div>
        </div>
    );
}

function Header() {
    return (
        <header className="w-full bg-blue-500 text-white py-4 text-center">
            <h1 className="text-2xl font-bold">YouTube Downloader</h1>
            <nav className="mt-4">
                <ul className="flex gap-4 justify-center">
                    <li>
                        <Link to="/" className="text-white hover:underline">
                            Video Download
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/image-download"
                            className="text-white hover:underline"
                        >
                            Image Download
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/shorten-url"
                            className="text-white hover:underline"
                        >
                            URL Shortener
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/code-beautifier"
                            className="text-white hover:underline"
                        >
                            Code Beautifier
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/meme-edit"
                            className="text-white hover:underline"
                        >
                            Meme Generator
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MainLayout;
