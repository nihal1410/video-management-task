import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    axios
      .get("/api/videos")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Error fetching videos:", err));
  };

  const handleDelete = (name) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      axios
        .delete(`/api/videos/${name}`)
        .then(() => {
          alert("Video deleted successfully!");
          fetchVideos(); 
        })
        .catch((err) => alert("Failed to delete video."));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Video Manager</h1>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link to="/learning" className="hover:underline">
                Learning
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </nav>


      <div className="container mx-auto p-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Manage your recorded videos. Record new ones or play existing ones!
          </p>
        </header>


        <div className="mb-6">
          <Link to="/record">
            <button className="rounded-lg bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition">
              Record Video
            </button>
          </Link>
        </div>


        {videos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Play</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, index) => (
                  <tr
                    key={index}
                    className={`text-center ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {video.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(video.timestamp).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Link to={`/player/${video.name}`}>
                        <button className="rounded-sm px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition">
                          Play
                        </button>
                      </Link>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                      <button
                        onClick={() => handleDelete(video.name)}
                        className="rounded-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                      <a
                        href={`/api/video/${video.name}`}
                        download={video.name}
                        className="rounded-sm px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No videos found. Start recording!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
