const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffprobeInstaller = require("@ffprobe-installer/ffprobe");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

var videoController = {
    download: async (req, res) => {
        const { url, fileType } = req.body;
        let filter;
        let extension;

        if (fileType === "audio") {
            filter = "audioonly";
            extension = "mp3";
        } else {
            filter = "audioandvideo";
            extension = "mp4";
        }

        res.header(
            "Content-Disposition",
            `attachment; filename="download.${extension}"`
        );
        ytdl(url, { filter: filter })
            .pipe(res)
            .on("error", (err) => {
                console.error(err);
                res.status(500).send("Error downloading file");
            });
    },
    mergeVideos: async (req, res) => {
        const { urls } = req.body;
        const tempDir = path.join(__dirname, "temp");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        try {
            const videoPaths = await Promise.all(
                urls.map((url, index) => {
                    return new Promise((resolve, reject) => {
                        const videoPath = path.join(
                            tempDir,
                            `video${index}.mp4`
                        );
                        ytdl(url, { filter: "audioandvideo" })
                            .pipe(fs.createWriteStream(videoPath))
                            .on("finish", () => resolve(videoPath))
                            .on("error", (err) => reject(err));
                    });
                })
            );

            const listFilePath = path.join(tempDir, "filelist.txt");
            const listFileContent = videoPaths
                .map((videoPath) => `file '${videoPath}'`)
                .join("\n");
            fs.writeFileSync(listFilePath, listFileContent);

            const mergedVideoPath = path.join(tempDir, "mergedVideo.mp4");

            ffmpeg()
                .input(listFilePath)
                .inputOptions(["-f", "concat", "-safe", "0"])
                .outputOptions("-c", "copy")
                .output(mergedVideoPath)
                .on("error", (err) => {
                    console.error("FFmpeg Error: " + err.message);
                    res.status(500).send("Error merging videos");
                })
                .on("end", () => {
                    res.download(mergedVideoPath, "mergedVideo.mp4", (err) => {
                        if (err) {
                            console.error("Error sending file: " + err.message);
                            res.status(500).send("Error sending file");
                        }
                        // Clean up temporary files
                        videoPaths.forEach((videoPath) =>
                            fs.unlinkSync(videoPath)
                        );
                        fs.unlinkSync(mergedVideoPath);
                        fs.unlinkSync(listFilePath);
                    });
                })
                .run();
        } catch (err) {
            console.error("Error: " + err.message);
            res.status(500).send("Error processing videos");
        }
    },
};

module.exports = videoController;
