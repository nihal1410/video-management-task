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

if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

const app = express();
const client_url = path.join(cwd(), "client", "dist");
app.use(cors());
app.use(express.json());
app.use(express.static(client_url));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_DIR); 
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); 
    const filename = `video_${timestamp}${path.extname(file.originalname)}`; // Append the original extension
    cb(null, filename);
  },
});

const upload = multer({ dest: "videos/", storage });


app.post("/api/record", upload.single("video"), (req, res) => {
  res.json({
    message: "Video uploaded successfully!",
    fileName: req.file.filename,
  });
});

app.get("/api/videos", (req, res) => {
  const files = fs.readdirSync("videos/").map((file) => ({
    name: file,
    url: `/video/${file}`,
    timestamp: parseInt(`${file.split("_")[1].split(".")[0]}`),
  }));
  res.json(files);
});

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

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);


app.delete("/api/videos/:name", (req, res) => {
  const videoName = req.params.name;
  const videoPath = path.join(VIDEO_DIR, videoName);

  if (fs.existsSync(videoPath)) {
    fs.unlink(videoPath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ error: "Failed to delete video." });
      }
      return res.status(200).json({ message: "Video deleted successfully." });
    });
  } else {
    return res.status(404).json({ error: "Video not found." });
  }
});
