import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { cwd } from "process";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 8080;
const VIDEO_DIR = path.join(cwd(), "videos");

const app = express();
const client_url = path.join(cwd(), "client", "dist");
app.use(cors());
app.use(express.json());
app.use(express.static(client_url));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_DIR); // Save files in the video directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Generate a timestamp
    const filename = `video_${timestamp}${path.extname(file.originalname)}`; // Append the original extension
    cb(null, filename);
  },
});

const upload = multer({ dest: "videos/", storage });

// Routes
// 1. Upload video
app.post("/api/record", upload.single("video"), (req, res) => {
  res.json({
    message: "Video uploaded successfully!",
    fileName: req.file.filename,
  });
});

// 2. Get list of videos
app.get("/api/videos", (req, res) => {
  const files = fs.readdirSync("videos/").map((file) => ({
    name: file,
    url: `/video/${file}`,
    timestamp: parseInt(`${file.split("_")[1].split(".")[0]}`),
  }));
  res.json(files);
});

// 3. Stream specific video
app.get("/api/video/:id", (req, res) => {
  const videoPath = path.join(cwd(), "videos", req.params.id);
  if (fs.existsSync(videoPath)) {
    res.sendFile(videoPath);
  } else {
    res.status(404).send("Video not found");
  }
});

app.get("*", (req, res) => {
  res.sendFile("index.html", { root: client_url });
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
