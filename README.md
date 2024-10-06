# YouTube Downloader

## Project Overview

The YouTube Downloader is a web application that allows users to download videos and audio from YouTube. It provides a user-friendly interface for downloading individual videos, merging multiple videos, and downloading images. The application is built using React for the frontend and Node.js with Express for the backend.

### Features

-   Download YouTube videos and audio in various formats.
-   Merge multiple videos into a single file.
-   Download images from a specified source.
-   Code beautifier for formatting JavaScript, HTML, CSS, JSON, and SQL code.
-   Meme generator with customizable templates.

## Technologies Used

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: Node.js, Express, ytdl-core, fluent-ffmpeg
-   **Database**: Not applicable (the application does not use a database)
-   **Other Libraries**: Axios, Puppeteer, FileSaver, etc.

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm (Node Package Manager)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/youtube-downloader.git
    cd youtube-downloader
    ```

2. **Install dependencies for the backend**:

    Navigate to the backend directory and install the required packages:

    ```bash
    cd backend
    npm install
    ```

3. **Install dependencies for the frontend**:

    Navigate to the frontend directory and install the required packages:

    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1. **Start the backend server**:

    Navigate to the backend directory and run the server:

    ```bash
    cd backend
    npm start
    ```

    The backend server will run on `http://localhost:5000`.

2. **Start the frontend application**:

    Open a new terminal window, navigate to the frontend directory, and run the application:

    ```bash
    cd frontend
    npm start
    ```

    The frontend application will run on `http://localhost:3000`.

### Usage

-   Open your web browser and go to `http://localhost:3000`.
-   Use the provided features to download videos, merge videos, download images, or beautify code.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.
