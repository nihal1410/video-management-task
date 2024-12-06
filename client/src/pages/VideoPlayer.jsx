import React from "react";
import { useParams } from "react-router-dom";

function VideoPlayer() {
  const { id } = useParams();

  return (
    <div>
      <div className="p-4 bg-gray-800 text-white flex gap-4 items-center justify-between">
        <h1 className="text-2xl">Video Player</h1>
        <a href="/" className="underline">
          Dashboard
        </a>
      </div>
      <div className="p-4">
        <video controls>
          <source src={`/api/video/${id}`} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default VideoPlayer;
