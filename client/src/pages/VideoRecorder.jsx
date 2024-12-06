import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function VideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [previewAvailable, setPreviewAvailable] = useState(false);
  const videoRef = useRef();
  const previewRef = useRef();

  useEffect(() => {
    try {
      videoRef.current.classList.add("hidden");
    } catch {}
  }, []);

  const startRecording = async () => {
    videoRef.current.classList.toggle("hidden");

    try {
      // Request both video and audio streams
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/mp4" });
        setVideoBlob(blob);
        setPreviewAvailable(true);
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stop both video and audio tracks
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert(
        "Could not access your camera or microphone. Please check permissions."
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    videoRef.current.classList.toggle("hidden");
    setIsRecording(false);
    setIsPaused(false);
  };

  const saveVideo = async () => {
    if (!videoBlob) {
      alert("No video to save!");
      return;
    }

    const formData = new FormData();
    const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); // Create a timestamp (e.g., 20231206120000)
    const filename = `video_${timestamp}.mp4`; // Example: video_20231206120000.mp4
    formData.append("video", videoBlob, filename); // Attach the video blob with the timestamped name

    console.log({ formData });

    try {
      await axios.post("/api/record", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video saved successfully!");
      setPreviewAvailable(false);
      setVideoBlob(null); // Clear the preview after saving
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Failed to save the video.");
    }
  };

  return (
    <div>
      <div className="p-4 bg-gray-800 text-white flex gap-4 items-center justify-between">
        <h1 className="text-2xl">Record Video</h1>
        <a href="/" className="underline">
          Dashboard
        </a>
      </div>
      <div className="p-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: "100%", maxHeight: "400px" }}
        ></video>
      </div>
      <div className="p-4">
        {!isRecording ? (
          <button
            className="rounded-sm p-2 bg-red-600 text-white"
            onClick={startRecording}
          >
            Start Recording
          </button>
        ) : (
          <div className="flex gap-2">
            {!isPaused ? (
              <button
                className="rounded-sm p-2 bg-yellow-600 text-white"
                onClick={pauseRecording}
              >
                Pause Recording
              </button>
            ) : (
              <button
                className="rounded-sm p-2 bg-red-600 text-white"
                onClick={resumeRecording}
              >
                Resume Recording
              </button>
            )}
            <button
              className="rounded-sm p-2 bg-blue-600 text-white"
              onClick={stopRecording}
            >
              Stop Recording
            </button>
          </div>
        )}
      </div>
      {previewAvailable && (
        <div className="p-4 flex flex-col gap-2">
          <h3>Preview Your Recording</h3>
          <video
            ref={previewRef}
            controls
            src={URL.createObjectURL(videoBlob)}
            style={{ width: "100%", maxHeight: "400px" }}
          ></video>
          <button
            className="rounded-sm p-2 bg-blue-600 text-white w-fit"
            onClick={saveVideo}
          >
            Save Video
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoRecorder;
